import * as angular from "angular";
import "./tooltip.css";

export const TooltipProvider = function() {

  // The default options tooltip and popover.
  const defaultOptions = {
    animation: true,
    placement: "top",
    placementClassPrefix: "",
    popupCloseDelay: 0,
    popupDelay: 0,
    useContentExp: false
  };

  // Default hide triggers for each show trigger
  const triggerMap = {
    click: "click",
    focus: "blur",
    mouseenter: "mouseleave",
    none: "",
    outsideClick: "outsideClick"
  };

  // The options specified to the provider globally.
  const globalOptions = {};

  /**
   * `options({})` allows global configuration of all tooltips in the
   * application.
   *
   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
   */
  this.options = (value) => {
        angular.extend(globalOptions, value);
    };

  /**
   * This allows you to extend the set of trigger mappings available. E.g.:
   *
   *   $tooltipProvider.setTriggers( { 'openTrigger': 'closeTrigger' } );
   */
  this.setTriggers = function setTriggers(triggers) {
    angular.extend(triggerMap, triggers);
  };

  /**
   * This is a helper function for translating camel-case to snake_case.
   */
  function snake_case(name) {
    const regexp = /[A-Z]/g;
    const separator = "-";
    return name.replace(regexp, (letter, pos) => {
      return (pos ? separator : "") + letter.toLowerCase();
    });
  }

  /**
   * Returns the actual instance of the $tooltip service.
   * TODO support multiple triggers
   */
  this.$get = [
      "$compile",
      "$timeout",
      "$document",
      "$uibPosition",
      "$interpolate",
      "$rootScope",
      "$parse",
      "$$stackedMap", (
          $compile,
          $timeout,
          $document,
          $position,
          $interpolate,
          $rootScope,
          $parse,
          $$stackedMap) => {
    const openedTooltips = $$stackedMap.createNew();
    $document.on("keyup", keypressListener);

    $rootScope.$on("$destroy", () => {
      $document.off("keyup", keypressListener);
    });

    function keypressListener(e) {
      if (e.which === 27) {
        let last = openedTooltips.top();
        if (last) {
          last.value.close();
          last = null;
        }
      }
    }

    return function $tooltip(ttType, prefix, defaultTriggerShow, options) {
      options = angular.extend({}, defaultOptions, globalOptions, options);

      /**
       * Returns an object of show and hide triggers.
       *
       * If a trigger is supplied,
       * it is used to show the tooltip; otherwise, it will use the `trigger`
       * option passed to the `$tooltipProvider.options` method; else it will
       * default to the trigger supplied to this directive factory.
       *
       * The hide trigger is based on the show trigger. If the `trigger` option
       * was passed to the `$tooltipProvider.options` method, it will use the
       * mapped trigger from `triggerMap` or the passed trigger if the map is
       * undefined; otherwise, it uses the `triggerMap` value of the show
       * trigger; else it will just use the show trigger.
       */
      function getTriggers(trigger) {
        const show = (trigger || options.trigger || defaultTriggerShow).split(" ");
        const hide = show.map((triggerType: string | number) => {
          return triggerMap[triggerType] || trigger;
        });
        return { show, hide };
      }

      const directiveName = snake_case(ttType);

      const startSym = $interpolate.startSymbol();
      const endSym = $interpolate.endSymbol();
      const template =
        "<div " + directiveName + "-popup " +
          'uib-title="' + startSym + "title" + endSym + '" ' +
          (options.useContentExp ?
            'content-exp="contentExp()" ' :
            'content="' + startSym + "content" + endSym + '" ') +
          'origin-scope="origScope" ' +
          'class="uib-position-measure ' + prefix + '" ' +
          'tooltip-animation-class="fade"' +
          "uib-tooltip-classes " +
          'ng-class="{ in: isOpen }" ' +
          ">" +
        "</div>";

      return {
        compile(tElem, tAttrs) {
          const tooltipLinker = $compile(template);

          return function link(scope, element, attrs, tooltipCtrl) {
            let tooltip;
            let tooltipLinkedScope;
            let transitionTimeout;
            let showTimeout;
            let hideTimeout;
            let positionTimeout;
            let adjustmentTimeout;
            let appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
            let triggers = getTriggers(undefined);
            const hasEnableExp = angular.isDefined(attrs[prefix + "Enable"]);
            let ttScope = scope.$new(true);
            let repositionScheduled = false;
            const isOpenParse = angular.isDefined(attrs[prefix + "IsOpen"]) ? $parse(attrs[prefix + "IsOpen"]) : false;
            const contentParse = options.useContentExp ? $parse(attrs[ttType]) : false;
            const observers = [];
            let lastPlacement;

            const positionTooltip = () => {
              // check if tooltip exists and is not empty
              if (!tooltip || !tooltip.html()) { return; }

              if (!positionTimeout) {
                positionTimeout = $timeout(() => {
                  const ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                  const initialHeight =
                    angular.isDefined(tooltip.offsetHeight) ? tooltip.offsetHeight : tooltip.prop("offsetHeight");
                  const elementPos = appendToBody ? $position.offset(element) : $position.position(element);
                  tooltip.css({ top: ttPosition.top + "px", left: ttPosition.left + "px" });
                  const placementClasses = ttPosition.placement.split("-");

                  if (!tooltip.hasClass(placementClasses[0])) {
                    tooltip.removeClass(lastPlacement.split("-")[0]);
                    tooltip.addClass(placementClasses[0]);
                  }

                  if (!tooltip.hasClass(options.placementClassPrefix + ttPosition.placement)) {
                    tooltip.removeClass(options.placementClassPrefix + lastPlacement);
                    tooltip.addClass(options.placementClassPrefix + ttPosition.placement);
                  }

                  adjustmentTimeout = $timeout(() => {
                    const currentHeight =
                        angular.isDefined(tooltip.offsetHeight) ? tooltip.offsetHeight : tooltip.prop("offsetHeight");
                    const adjustment = $position.adjustTop(placementClasses, elementPos, initialHeight, currentHeight);
                    if (adjustment) {
                      tooltip.css(adjustment);
                    }
                    adjustmentTimeout = null;
                  }, 0, false);

                  // first time through tt element will have the
                  // uib-position-measure class or if the placement
                  // has changed we need to position the arrow.
                  if (tooltip.hasClass("uib-position-measure")) {
                    $position.positionArrow(tooltip, ttPosition.placement);
                    tooltip.removeClass("uib-position-measure");
                  } else if (lastPlacement !== ttPosition.placement) {
                    $position.positionArrow(tooltip, ttPosition.placement);
                  }
                  lastPlacement = ttPosition.placement;

                  positionTimeout = null;
                }, 0, false);
              }
            };

            // Set up the correct scope to allow transclusion later
            ttScope.origScope = scope;

            // By default, the tooltip is not open.
            // TODO add ability to start tooltip opened
            ttScope.isOpen = false;

            function toggleTooltipBind() {
              if (!ttScope.isOpen) {
                showTooltipBind();
              } else {
                hideTooltipBind();
              }
            }

            // Show the tooltip with delay if specified, otherwise show it immediately
            function showTooltipBind() {
              if (hasEnableExp && !scope.$eval(attrs[prefix + "Enable"])) {
                return;
              }

              cancelHide();
              prepareTooltip();

              if (ttScope.popupDelay) {
                // Do nothing if the tooltip was already scheduled to pop-up.
                // This happens if show is triggered multiple times before any hide is triggered.
                if (!showTimeout) {
                  showTimeout = $timeout(show, ttScope.popupDelay, false);
                }
              } else {
                show();
              }
            }

            function hideTooltipBind() {
              cancelShow();

              if (ttScope.popupCloseDelay) {
                if (!hideTimeout) {
                  hideTimeout = $timeout(hide, ttScope.popupCloseDelay, false);
                }
              } else {
                hide();
              }
            }

            // Show the tooltip popup element.
            function show() {
              cancelShow();
              cancelHide();

              // Don't show empty tooltips.
              if (!ttScope.content) {
                return angular.noop;
              }

              createTooltip();

              // And show the tooltip.
              ttScope.$evalAsync(() => {
                ttScope.isOpen = true;
                assignIsOpen(true);
                positionTooltip();
              });
            }

            function cancelShow() {
              if (showTimeout) {
                $timeout.cancel(showTimeout);
                showTimeout = null;
              }

              if (positionTimeout) {
                $timeout.cancel(positionTimeout);
                positionTimeout = null;
              }
            }

            // Hide the tooltip popup element.
            function hide() {
              if (!ttScope) {
                return;
              }

              // First things first: we don't show it anymore.
              ttScope.$evalAsync(() => {
                if (ttScope) {
                  ttScope.isOpen = false;
                  assignIsOpen(false);
                  // And now we remove it from the DOM. However, if we have animation, we
                  // need to wait for it to expire beforehand.
                  // FIXME: this is a placeholder for a port of the transitions library.
                  // The fade transition in TWBS is 150ms.
                  if (ttScope.animation) {
                    if (!transitionTimeout) {
                      transitionTimeout = $timeout(removeTooltip, 150, false);
                    }
                  } else {
                    removeTooltip();
                  }
                }
              });
            }

            function cancelHide() {
              if (hideTimeout) {
                $timeout.cancel(hideTimeout);
                hideTimeout = null;
              }

              if (transitionTimeout) {
                $timeout.cancel(transitionTimeout);
                transitionTimeout = null;
              }
            }

            function createTooltip() {
              // There can only be one tooltip element per directive shown at once.
              if (tooltip) {
                return;
              }

              tooltipLinkedScope = ttScope.$new();
              tooltip = tooltipLinker(tooltipLinkedScope, (tooltipParam) => {
                if (appendToBody) {
                  $document.find("body").append(tooltipParam);
                } else {
                  element.after(tooltipParam);
                }
              });

              openedTooltips.add(ttScope, {
                close: hide
              });

              prepObservers();
            }

            function removeTooltip() {
              cancelShow();
              cancelHide();
              unregisterObservers();

              if (tooltip) {
                tooltip.remove();

                tooltip = null;
                if (adjustmentTimeout) {
                  $timeout.cancel(adjustmentTimeout);
                }
              }

              openedTooltips.remove(ttScope);

              if (tooltipLinkedScope) {
                tooltipLinkedScope.$destroy();
                tooltipLinkedScope = null;
              }
            }

            /**
             * Set the initial scope values. Once
             * the tooltip is created, the observers
             * will be added to keep things in sync.
             */
            function prepareTooltip() {
              ttScope.title = attrs[prefix + "Title"];
              if (contentParse) {
                ttScope.content = contentParse(scope);
              } else {
                ttScope.content = attrs[ttType];
              }

              ttScope.popupClass = attrs[prefix + "Class"];
              ttScope.placement =
                angular.isDefined(attrs[prefix + "Placement"]) ? attrs[prefix + "Placement"] : options.placement;
              const placement = $position.parsePlacement(ttScope.placement);
              lastPlacement = placement[1] ? placement[0] + "-" + placement[1] : placement[0];

              const delay = parseInt(attrs[prefix + "PopupDelay"], 10);
              const closeDelay = parseInt(attrs[prefix + "PopupCloseDelay"], 10);
              ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
              ttScope.popupCloseDelay = !isNaN(closeDelay) ? closeDelay : options.popupCloseDelay;
            }

            function assignIsOpen(isOpen) {
              if (isOpenParse && angular.isFunction(isOpenParse.assign)) {
                isOpenParse.assign(scope, isOpen);
              }
            }

            ttScope.contentExp = () => {
              return ttScope.content;
            };

            /**
             * Observe the relevant attributes.
             */
            attrs.$observe("disabled", (val) => {
              if (val) {
                cancelShow();
              }

              if (val && ttScope.isOpen) {
                hide();
              }
            });

            if (isOpenParse) {
              scope.$watch(isOpenParse, (val) => {
                if (ttScope && !val === ttScope.isOpen) {
                  toggleTooltipBind();
                }
              });
            }

            function prepObservers() {
              observers.length = 0;

              if (contentParse) {
                observers.push(
                  scope.$watch(contentParse, (val) => {
                    ttScope.content = val;
                    if (!val && ttScope.isOpen) {
                      hide();
                    }
                  })
                );

                observers.push(
                  tooltipLinkedScope.$watch(() => {
                    if (!repositionScheduled) {
                      repositionScheduled = true;
                      tooltipLinkedScope.$$postDigest(() => {
                        repositionScheduled = false;
                        if (ttScope && ttScope.isOpen) {
                          positionTooltip();
                        }
                      });
                    }
                  })
                );
              } else {
                observers.push(
                  attrs.$observe(ttType, (val) => {
                    ttScope.content = val;
                    if (!val && ttScope.isOpen) {
                      hide();
                    } else {
                      positionTooltip();
                    }
                  })
                );
              }

              observers.push(
                attrs.$observe(prefix + "Title", (val) => {
                  ttScope.title = val;
                  if (ttScope.isOpen) {
                    positionTooltip();
                  }
                })
              );

              observers.push(
                attrs.$observe(prefix + "Placement", (val) => {
                  ttScope.placement = val ? val : options.placement;
                  if (ttScope.isOpen) {
                    positionTooltip();
                  }
                })
              );
            }

            function unregisterObservers() {
              if (observers.length) {
                angular.forEach(observers, (observer) => {
                  observer();
                });
                observers.length = 0;
              }
            }

            // hide tooltips/popovers for outsideClick trigger
            function bodyHideTooltipBind(e) {
              if (!ttScope || !ttScope.isOpen || !tooltip) {
                return;
              }
              // make sure the tooltip/popover link or tool tooltip/popover itself were not clicked
              if (!element[0].contains(e.target) && !tooltip[0].contains(e.target)) {
                hideTooltipBind();
              }
            }

            // KeyboardEvent handler to hide the tooltip on Escape key press
            function hideOnEscapeKey(e) {
              if (e.which === 27) {
                hideTooltipBind();
              }
            }

            const unregisterTriggers = () => {
              triggers.show.forEach((trigger) => {
                if (trigger === "outsideClick") {
                  element.off("click", toggleTooltipBind);
                } else {
                  element.off(trigger, showTooltipBind);
                  element.off(trigger, toggleTooltipBind);
                }
                element.off("keypress", hideOnEscapeKey);
              });
              triggers.hide.forEach((trigger) => {
                if (trigger === "outsideClick") {
                  $document.off("click", bodyHideTooltipBind);
                } else {
                  element.off(trigger, hideTooltipBind);
                }
              });
            };

            function prepTriggers() {
              const showTriggers = [];
              const hideTriggers = [];
              const val = scope.$eval(attrs[prefix + "Trigger"]);
              unregisterTriggers();

              if (angular.isObject(val)) {
                Object.keys(val).forEach((key) => {
                  showTriggers.push(key);
                  hideTriggers.push(val[key]);
                });
                triggers = { show: showTriggers, hide: hideTriggers };
              } else {
                triggers = getTriggers(val);
              }

              if (triggers.show !== "none") {
                triggers.show.forEach((trigger, idx) => {
                  if (trigger === "outsideClick") {
                    element.on("click", toggleTooltipBind);
                    $document.on("click", bodyHideTooltipBind);
                  } else if (trigger === triggers.hide[idx]) {
                    element.on(trigger, toggleTooltipBind);
                  } else if (trigger) {
                    element.on(trigger, showTooltipBind);
                    element.on(triggers.hide[idx], hideTooltipBind);
                  }
                  element.on("keypress", hideOnEscapeKey);
                });
              }
            }

            prepTriggers();

            const animation = scope.$eval(attrs[prefix + "Animation"]);
            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

            let appendToBodyVal;
            const appendKey = prefix + "AppendToBody";
            if (appendKey in attrs && attrs[appendKey] === undefined) {
              appendToBodyVal = true;
            } else {
              appendToBodyVal = scope.$eval(attrs[appendKey]);
            }

            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

            // Make sure tooltip is destroyed and removed.
            scope.$on("$destroy", function onDestroyTooltip() {
              unregisterTriggers();
              removeTooltip();
              ttScope = null;
            });
          };
        }
      };
    };
  }];
};

export const CustomMatchers = {
    toHaveCssClass(
      util: jasmine.MatchersUtil,
      customEqualityTests: jasmine.CustomEqualityTester[]): jasmine.CustomMatcher {
      return {
        compare: buildError(false),
        negativeCompare: buildError(true)
      } as jasmine.CustomMatcher;

      function buildError(isNot: boolean) {
        return (actual: HTMLElement, className: string): jasmine.CustomMatcherResult => {
          return {
            message: `Expected ${actual.outerHTML} ${isNot ? "not " : ""}to contain the CSS class "${className}"`,
            pass: actual.classList.contains(className) === !isNot
          };
        };
      }
    },
    toHaveModal(
      util: jasmine.MatchersUtil,
      customEqualityTests: jasmine.CustomEqualityTester[]): jasmine.CustomMatcher {
      return {
        compare(actual, content?, selector?) {
          const allModalsContent = document.querySelector(selector || "body").querySelectorAll(".modal-content");
          let pass = true;
          let errMsg;

          if (!content) {
            pass = allModalsContent.length > 0;
            errMsg = "at least one modal open but found none";
          } else if (Array.isArray(content)) {
            pass = allModalsContent.length === content.length;
            errMsg = `${content.length} modals open but found ${allModalsContent.length}`;
          } else {
            pass = allModalsContent.length === 1 && allModalsContent[0].textContent.trim() === content;
            errMsg = `exactly one modal open but found ${allModalsContent.length}`;
          }

          return {pass, message: `Expected ${actual.outerHTML} to have ${errMsg}`};
        },
        negativeCompare(actual) {
          const allOpenModals = actual.querySelectorAll("ngb-modal-window");

          return {
            message: `Expected ${actual.outerHTML} not to have any modals open but found ${allOpenModals.length}`,
            pass: allOpenModals.length === 0,
          };
        }
      } as jasmine.CustomMatcher;
    },
    toHaveBackdrop(util, customEqualityTests) {
      return {
        compare(actual) {
          return {
            message: `Expected ${actual.outerHTML} to have exactly one backdrop element`,
            pass: document.querySelectorAll("ngb-modal-backdrop").length === 1
          };
        },
        negativeCompare(actual) {
          const allOpenModals = document.querySelectorAll("ngb-modal-backdrop");

          return {
            message: `Expected ${actual.outerHTML} not to have any backdrop elements`,
            pass: allOpenModals.length === 0,
          };
        }
      };
    }
  };

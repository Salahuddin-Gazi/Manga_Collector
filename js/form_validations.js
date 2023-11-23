import { addHiddenClassToSearchError, selector } from "./utils.js";

export function submitSearchFormValidation(value) {
  if (!value || typeof value != "string") {
    selector(".empty-input-error").classList.contains("is-hidden") &&
      selector(".empty-input-error").classList.remove("is-hidden");
    return { error: true, msg: "Empty Input Error" };
  } else if (
    !!/(?:https?:\/\/)?(?:www\.)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g.exec(
      value
    ) &&
    !/(?:https?:\/\/)?(?:www\.)?mangasee123\.com\/(?:read-online\/[a-zA-Z0-9-]+-chapter-\d+-page-\d+\.html|manga\/[a-zA-Z0-9-]+)$/g.exec(
      value
    )
  ) {
    selector(".link-input-error").classList.contains("is-hidden") &&
      selector(".link-input-error").classList.remove("is-hidden");
    return { error: true, msg: "Link Input Error" };
  } else if (
    !/^(?![\d\s!@#$%^&*()_+-=,.<>?;:'"{}[\]|\\/]+?$)[\w\d\s!@#$%^&*()_+-=,.<>?;:'"{}[\]|\\/]+$/.exec(
      value
    )
  ) {
    selector(".value-input-error").classList.contains("is-hidden") &&
      selector(".value-input-error").classList.remove("is-hidden");
    return { error: true, msg: "Value Input Error" };
  } else {
    addHiddenClassToSearchError();
    return { error: false, msg: "No Error" };
  }
}

export function collectMangaFormValidation(start, max) {
  if (start.length > 0) {
    var err = { error: false, msg: "no error" };
    var startValue = parseInt(start);
    if (!!startValue) {
      var maxValue = max ? parseInt(max) : null;
      if (startValue <= maxValue) {
      } else {
        selector(".error-out-of-range-value").classList.contains("is-hidden") &&
          selector(".error-out-of-range-value").classList.remove("is-hidden");
        err = { error: true, msg: "out of range error" };
        console.log(err);
      }
    } else {
      selector(".error-range-input-value").classList.contains("is-hidden") &&
        selector(".error-range-input-value").classList.remove("is-hidden");
      err = { error: true, msg: "Error range number input value" };
      console.log(err);
    }
    return err;
  } else {
    // console.log(selector(".error-range-input-invalid-value"));
    selector(".error-range-input-invalid-value").classList.contains(
      "is-hidden"
    ) &&
      selector(".error-range-input-invalid-value").classList.remove(
        "is-hidden"
      );
    console.log({ error: true, msg: "Invalid start value" });
    return { error: true, msg: "Invalid start value" };
  }
}

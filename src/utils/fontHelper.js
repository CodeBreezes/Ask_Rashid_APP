import i18n from "../i18n/index";

export const getFont = () => {
  return i18n.language === "ar" ? "NotoKufiArabic-Regular" : undefined;
};

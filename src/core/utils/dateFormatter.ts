// src/core/utils/dateFormatter.ts
import i18n from "../i18n";

/**
 * Formats a JavaScript Date object into a custom Hijri date string.
 * @param date The Date object to format.
 * @returns A formatted string, e.g., "Rab Awal 6, 1447".
 */
export const formatHijriDate = (date: Date): string => {
  const isArabic = i18n.locale.startsWith("ar");

  // This formatter's only job is to give us the numeric parts of the Hijri date.
  const hijriNumericParser = new Intl.DateTimeFormat(
    `${isArabic ? "ar" : "en"}-u-ca-islamic-nu-latn`,
    {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    },
  );

  // Get the numeric parts of the date
  const parts = hijriNumericParser.formatToParts(date);
  const day = parts.find((p) => p.type === "day")?.value;
  const monthIndex =
    parseInt(parts.find((p) => p.type === "month")?.value || "1", 10) - 1;
  const year = parts.find((p) => p.type === "year")?.value;

  // Look up our custom month name from the i18n files
  const hijriMonthName = (i18n.t("hijri_months") as string[])[monthIndex];

  // Construct the final string exactly as desired
  if (isArabic) {
    return `${hijriMonthName} ${day}، ${year}`;
  }
  return `${hijriMonthName} ${day}, ${year}`;
};

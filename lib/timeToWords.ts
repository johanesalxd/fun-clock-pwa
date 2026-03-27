export type SpokenLanguage = 'en-US' | 'en-GB' | 'id-ID';

export function getTimeAsWords(hours: number, minutes: number, lang: SpokenLanguage): string {
  if (lang === 'en-GB') return formatBritish(hours, minutes);
  if (lang === 'id-ID') return formatBahasa(hours, minutes);
  return formatGeneral(hours, minutes);
}

function formatGeneral(hours: number, minutes: number): string {
  if (hours === 0 && minutes === 0) return "It's midnight";
  if (hours === 12 && minutes === 0) return "It's noon";

  const isPM = hours >= 12;
  const h12 = hours % 12 || 12;
  const period = isPM ? "PM" : "AM";

  if (minutes === 0) {
    return `It's ${h12} o'clock ${period}`;
  } else if (minutes < 10) {
    return `It's ${h12} oh ${minutes} ${period}`;
  } else {
    return `It's ${h12} ${minutes} ${period}`;
  }
}

function formatBritish(hours: number, minutes: number): string {
  if (hours === 0 && minutes === 0) return "It's midnight";
  if (hours === 12 && minutes === 0) return "It's noon";

  let period = "";
  if (hours >= 0 && hours < 12) period = "in the morning";
  else if (hours >= 12 && hours < 18) period = "in the afternoon";
  else period = "in the evening";

  const h12 = hours % 12 || 12;
  const nextH12 = (hours + 1) % 12 || 12;

  if (minutes === 0) {
    return `It's ${h12} o'clock`;
  } else if (minutes === 15) {
    return `It's quarter past ${h12} ${period}`;
  } else if (minutes === 30) {
    return `It's half past ${h12} ${period}`;
  } else if (minutes === 45) {
    return `It's quarter to ${nextH12} ${period}`;
  } else if (minutes < 30) {
    return `It's ${minutes} past ${h12} ${period}`;
  } else {
    return `It's ${60 - minutes} to ${nextH12} ${period}`;
  }
}

function formatBahasa(hours: number, minutes: number): string {
  if (hours === 0 && minutes === 0) return "Sekarang tengah malam";
  if (hours === 12 && minutes === 0) return "Sekarang tengah hari";

  let period = "";
  if (hours >= 4 && hours <= 10) period = "pagi";
  else if (hours >= 11 && hours <= 14) period = "siang";
  else if (hours >= 15 && hours <= 17) period = "sore";
  else period = "malam";

  const h12 = hours % 12 || 12;
  const nextH12 = (hours + 1) % 12 || 12;

  if (minutes === 0) {
    return `Sekarang jam ${h12} ${period}`;
  } else if (minutes === 30) {
    return `Sekarang jam setengah ${nextH12} ${period}`;
  } else {
    return `Sekarang jam ${h12} ${minutes} ${period}`;
  }
}

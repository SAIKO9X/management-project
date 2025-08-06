import {
  differenceInMinutes,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isPast,
  isToday,
  isTomorrow,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const getDueMessage = (dueDate, title = "") => {
  if (!dueDate) {
    return { message: "Sem prazo definido", color: "text-gray-500" };
  }

  const due = new Date(dueDate);
  // Ajuste do fuso horário
  due.setMinutes(due.getMinutes() + due.getTimezoneOffset());
  const now = new Date();
  const shortTitle =
    title && title.trim()
      ? `${title.length > 30 ? title.substring(0, 30) + "..." : title}`
      : "A tarefa";

  // Já expirou
  if (isPast(due) && !isToday(due)) {
    return {
      message: `${shortTitle} expirou há ${formatTimeDistance(now, due)}`,
      color: "text-red-600",
      fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
    };
  }

  // Prazo é hoje
  if (isToday(due)) {
    const minutesDifference = differenceInMinutes(due, now);

    if (minutesDifference < 0) {
      return {
        message: `${shortTitle} expirou há ${formatTimeDistance(now, due)}`,
        color: "text-red-600",
        fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
      };
    }

    if (minutesDifference < 60) {
      return {
        message: `${shortTitle} expira em ${minutesDifference} ${
          minutesDifference === 1 ? "minuto" : "minutos"
        }`,
        color: "text-red-600",
        fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
      };
    }

    const hoursDifference = Math.floor(minutesDifference / 60);
    return {
      message: `${shortTitle} expira hoje em ${hoursDifference} ${
        hoursDifference === 1 ? "hora" : "horas"
      }`,
      color: "text-orange-600",
      fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
    };
  }

  // Prazo é amanhã
  if (isTomorrow(due)) {
    return {
      message: `${shortTitle} expira amanhã às ${format(due, "HH:mm", {
        locale: ptBR,
      })}`,
      color: "text-yellow-600",
      fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
    };
  }

  // Dentro de uma semana
  const daysDifference = differenceInDays(due, now);
  if (daysDifference < 7) {
    return {
      message: `${shortTitle} expira em ${daysDifference} ${
        daysDifference === 1 ? "dia" : "dias"
      }`,
      color: daysDifference <= 2 ? "text-yellow-500" : "text-green-600",
      fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
    };
  }

  // Mais de uma semana
  if (daysDifference < 30) {
    return {
      message: `${shortTitle} expira em ${daysDifference} dias`,
      color: "text-green-600",
      fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
    };
  }

  // Meses ou mais
  const monthsDifference = differenceInMonths(due, now);
  if (monthsDifference < 12) {
    return {
      message: `${shortTitle} expira em ${monthsDifference} ${
        monthsDifference === 1 ? "mês" : "meses"
      }`,
      color: "text-green-600",
      fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
    };
  }

  // Mais de um ano
  const yearsDifference = differenceInYears(due, now);
  return {
    message: `${shortTitle} expira em ${yearsDifference} ${
      yearsDifference === 1 ? "ano" : "anos"
    }`,
    color: "text-green-600",
    fullDate: format(due, "dd/MM/yyyy HH:mm", { locale: ptBR }),
  };
};

export const formatTimeDistance = (now, due) => {
  const minutesDifference = differenceInMinutes(now, due);

  if (minutesDifference < 60) {
    return `${minutesDifference} ${
      minutesDifference === 1 ? "minuto" : "minutos"
    }`;
  }

  const hoursDifference = Math.floor(minutesDifference / 60);
  if (hoursDifference < 24) {
    return `${hoursDifference} ${hoursDifference === 1 ? "hora" : "horas"}`;
  }

  const daysDifference = differenceInDays(now, due);
  if (daysDifference < 30) {
    return `${daysDifference} ${daysDifference === 1 ? "dia" : "dias"}`;
  }

  const monthsDifference = differenceInMonths(now, due);
  if (monthsDifference < 12) {
    return `${monthsDifference} ${monthsDifference === 1 ? "mês" : "meses"}`;
  }

  const yearsDifference = differenceInYears(now, due);
  return `${yearsDifference} ${yearsDifference === 1 ? "ano" : "anos"}`;
};

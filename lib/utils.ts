export const currency = "₹";

export const slotDateFormat = (slotDate: string) => {
  if (!slotDate) return "";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateArray = slotDate.split("_");
  if (dateArray.length !== 3) {
    return slotDate;
  }
  return (
    dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
  );
};

export const numberInputOnWheelPreventChange = (
  e: React.WheelEvent<HTMLInputElement>,
) => {
  // Prevent the input value change
  e.currentTarget.blur();

  // Prevent the page/container scrolling
  e.stopPropagation();
};

export const parseSlotDateTime = (
  slotDate: string,
  slotTime?: string,
): Date | null => {
  if (!slotDate) return null;

  const now = new Date();
  let day: number = now.getDate();
  let month: number = now.getMonth();
  let year: number = now.getFullYear();

  if (slotDate.includes("_")) {
    const parts = slotDate.split("_");
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
    if (parts[2]) {
      year = parseInt(parts[2], 10);
    }
  } else if (slotDate.includes("-")) {
    const parts = slotDate.split("-");
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      if (parts[2]) {
        year = parseInt(parts[2], 10);
      }
    }
  } else {
    // Handle formats like "4 Aug" or "4 Aug 2026"
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const parts = slotDate.trim().split(/\s+/);
    if (parts.length >= 2) {
      day = parseInt(parts[0], 10) || 1;
      const monthIdx = months.findIndex((m) =>
        parts[1].toLowerCase().startsWith(m),
      );
      if (monthIdx !== -1) {
        month = monthIdx;
      }
      if (parts[2]) {
        year = parseInt(parts[2], 10) || now.getFullYear();
      }
    } else {
      const parsed = new Date(slotDate);
      if (!isNaN(parsed.getTime())) {
        day = parsed.getDate();
        month = parsed.getMonth();
        year = parsed.getFullYear();
      } else {
        return null;
      }
    }
  }

  let hours = 23;
  let minutes = 59;

  if (slotTime) {
    const timeMatch = slotTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3];
      if (ampm) {
        if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
        if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
      }
    }
  }

  return new Date(year, month, day, hours, minutes);
};

export const isBookingPast = (
  slotDate: string,
  slotTime?: string,
): boolean => {
  const bookingDate = parseSlotDateTime(slotDate, slotTime);
  if (!bookingDate) return false;
  return bookingDate < new Date();
};

export const isBookingCompleted = (item: {
  isCompleted?: boolean;
  status?: string;
  cancelled?: boolean;
  slotDate?: string;
  slotTime?: string;
}): boolean => {
  if (item.cancelled || item.status === "cancelled") return false;
  if (item.isCompleted || item.status === "completed") return true;
  if (item.slotDate && isBookingPast(item.slotDate, item.slotTime)) return true;
  return false;
};

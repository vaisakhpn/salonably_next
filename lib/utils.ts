export const currency = "₹";

export const slotDateFormat = (slotDate: string) => {
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

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
  return (
    dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
  );
};

import React from "react";

interface TimeSlotSelectorProps {
  selectedSlots: string[];
  onChange: (slots: string[]) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedSlots,
  onChange,
}) => {
  // Generate time slots from 9:00 AM to 9:00 PM with 30 min intervals
  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = new Date();
    currentTime.setHours(9, 0, 0, 0); // Start at 9:00 AM
    const endTime = new Date();
    endTime.setHours(21, 0, 0, 0); // End at 9:00 PM

    while (currentTime <= endTime) {
      slots.push(
        currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return slots;
  };

  const allSlots = generateTimeSlots();

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      onChange(selectedSlots.filter((s) => s !== slot));
    } else {
      onChange([...selectedSlots, slot]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Available Time Slots
      </label>
      <div className="flex flex-wrap gap-3">
        {allSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => toggleSlot(slot)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              selectedSlots.includes(slot)
                ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Selected: {selectedSlots.length} slots
      </p>
    </div>
  );
};

export default TimeSlotSelector;

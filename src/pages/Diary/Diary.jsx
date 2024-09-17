import React, { useState } from 'react';
import DiaryComponent from '../../components/Diary/DiaryComponent';

export default function Diary() {
  const [consumedCalories, setConsumedCalories] = useState(0);

  const handleDateChange = (calories) => {
    setConsumedCalories(calories);
  };

  return (
    <div>
      <DiaryComponent onDateChange={handleDateChange} />
    </div>
  );
}
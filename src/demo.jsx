import React from 'react';
import Select from 'react-select';

const options = [
  { value: 'apple', label: 'Apple', index:0 },
  { value: 'banana', label: 'Banana' , index:1},
  { value: 'orange', label: 'Orange' , index:2 },
];

export const Demo = () => {
  const handleChange = (selectedOption,e) => {
    console.log(selectedOption,e.name);
  };

  return (
    <Select
      name='Fruit'
      options={options}
      onChange={(selectedOption,e) => handleChange(selectedOption.index,e)}
      placeholder="Select an option"
    />
  );
};

export default Demo;

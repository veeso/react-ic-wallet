import * as React from 'react';
import Container from './Container';

interface Props {
  id: string;
  className?: string;
  selectClassName?: string;
  disabled?: boolean;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  children: React.ReactNode;
}

const Select = (props: Props) => (
  <Container.Container className={`${props.className} mb-6`}>
    {props.label && (
      <label htmlFor={props.id} className="block mb-2 font-medium text-text">
        {props.label}
      </label>
    )}
    <select
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      className={`${props.selectClassName} bg-gray-50 border border-gray-300 text-brand text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5`}
    >
      {props.children}
    </select>
  </Container.Container>
);

export default Select;

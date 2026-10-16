// Shared by the field components (TextInput, Textarea, …): an InputWrapper around a control, from one props
// object. Internal; not exported from the package.
import { omit } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { joinClass } from '../../style-props';
import { InputWrapper, type InputWrapperOwnProps } from './input-wrapper';

/** The props a field passes to its InputWrapper. `class` and `style` go to the wrapper too: the whole field. */
export interface FieldWrapperProps extends Omit<InputWrapperOwnProps, 'children' | 'labelElement'> {
  /** Classes for the field's root. */
  class?: JSX.ClassValue | JSX.RemoveAttribute;
  /** Styles for the field's root. */
  style?: JSX.CSSProperties;
}

const WRAPPER_KEYS = [
  'label',
  'labelSection',
  'description',
  'error',
  'required',
  'withAsterisk',
  'size',
  'id',
  'class',
  'style',
] as const;

/** The field's props without the wrapper's: what goes to the control. */
export function controlProps<T extends FieldWrapperProps>(props: T): Omit<T, (typeof WRAPPER_KEYS)[number]> {
  return omit(props, ...WRAPPER_KEYS) as unknown as Omit<T, (typeof WRAPPER_KEYS)[number]>;
}

/** An InputWrapper from a field's props, with the field's root class. */
export function FieldWrapper(props: { field: FieldWrapperProps; rootClass: string; children: JSX.Element }) {
  return (
    <InputWrapper
      label={props.field.label}
      labelSection={props.field.labelSection}
      description={props.field.description}
      error={props.field.error}
      required={props.field.required}
      withAsterisk={props.field.withAsterisk}
      // Not `undefined`: an explicit undefined would override InputWrapper's default.
      size={props.field.size ?? 'md'}
      id={props.field.id}
      class={joinClass([props.rootClass], props.field.class)}
      style={props.field.style}
    >
      {props.children}
    </InputWrapper>
  );
}

import React, { PropsWithChildren } from "react";

export type ReactFCC<T = unknown> = React.FC<PropsWithChildren<T>>;

export type RequiredFieldsOnly<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};
// declare global window for client
declare const window: {
  safari: any;
  navigator: Navigator;
  [key: string]: any;
} & Window;

export type Maybe<T> = NonNullable<T> | undefined;

/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// 全局声明svg component定义
type SvgrComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const content: SvgrComponent;
  export default content;
}

// declare module '*.svg' {
//   export const ReactComponent: React.FunctionComponent<React.SVGProps<
//     SVGSVGElement
//   > & { title?: string }>;
//   const src: string;
//   export default src;
// }

declare module '*.scoped.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scoped.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface IChangedpi {
  changeDpiBlob: (blob, dpi) => Promise;
  changeDpiDataUrl: (base64Image, dpi) => string;
}
declare module 'changedpi' {
  const changeDpiBlob: (blob, dpi) => Promise;
  const changeDpiDataUrl: (base64Image, dpi) => string;
  export { changeDpiBlob, changeDpiDataUrl };
}


declare interface IChatItem {
  role?: string;
  avatar?: string;
  content?: string;
  datetime?: number | string;
}

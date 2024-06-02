import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  Pencil,
  ScrollText,
  BookAIcon,
  BookCopy,
  GraduationCap,
  Clapperboard,
  Blocks,
  Car,
  X,
} from "lucide-react";

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  pencil: Pencil,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  capperboard: Clapperboard,
  graduationCap: GraduationCap,
  blocks: Blocks,
  remember: ScrollText,
  book: BookAIcon,
  car: Car,
  collections: BookCopy,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      data-icon="google"
      viewBox="0 0 50 50"
      {...props}
    >
      <path
        fill="currentColor"
        d="M25.996 48C13.313 48 2.992 37.684 2.992 25S13.312 2 25.996 2a22.954 22.954 0 0115.492 5.996l.774.707-7.586 7.586-.703-.602a12.277 12.277 0 00-7.977-2.957c-6.766 0-12.273 5.504-12.273 12.27s5.507 12.27 12.273 12.27c4.879 0 8.734-2.493 10.55-6.739h-11.55V20.176l22.55.031.169.793c1.176 5.582.234 13.793-4.531 19.668C39.238 45.531 33.457 48 25.996 48z"
      ></path>
    </svg>
  ),
  logoMinhKim: ({ ...props }: LucideProps) => (
    <svg className="looka-1j8o68f" viewBox="0 -13 350 100" {...props}>
      <defs>
        <linearGradient id="SvgjsLinearGradient3081">
          <stop offset="0" stopColor="#006838"></stop>
          <stop offset="1" stopColor="#96cf24"></stop>
        </linearGradient>
      </defs>
      <path
        fill="#fff"
        d="M7.52 20l-3.7-8.18V20H.84V6.3h3.72l4.02 9.06L12.6 6.3h3.72V20h-3.04v-8.22L9.56 20H7.52zm13.58 0H18V6.3h3.1V20zm10.16 0l-5.52-8.68V20h-2.98V6.3h3.38l5.52 8.7V6.3h2.98V20h-3.38zm13.96 0v-5.36h-5.8V20h-3.1V6.3h3.1v5.5h5.8V6.3h3.1V20h-3.1zm7.88-7.32l4.88-6.38h3.62l-5.44 6.84 5.6 6.86h-4.02l-4.64-5.84V20H50V6.3h3.1v6.38zM65.64 20h-3.1V6.3h3.1V20zm8.34 0l-3.7-8.18V20H67.3V6.3h3.72l4.02 9.06 4.02-9.06h3.72V20h-3.04v-8.22L76.02 20h-2.04z"
        transform="matrix(4.27142 0 0 4.27142 -3.588 -26.91)"
      ></path>
      <path
        fill="url(#SvgjsLinearGradient3081)"
        d="M5.64 20.3c-.613 0-1.187-.117-1.72-.35s-1-.55-1.4-.95-.717-.867-.95-1.4-.35-1.107-.35-1.72c0-.253.087-.467.26-.64s.387-.26.64-.26c.24 0 .447.087.62.26s.26.387.26.64c0 .36.07.7.21 1.02s.33.6.57.84.52.43.84.57.66.21 1.02.21.703-.07 1.03-.21.61-.33.85-.57.43-.52.57-.84.21-.66.21-1.02c0-.44-.087-.803-.26-1.09s-.413-.537-.72-.75c-.147-.107-.313-.203-.5-.29l-.58-.27A30.59 30.59 0 004.96 13c-.44-.16-.883-.34-1.33-.54s-.847-.45-1.2-.75-.643-.673-.87-1.12-.34-.997-.34-1.65c0-.613.117-1.187.35-1.72s.55-1 .95-1.4.867-.717 1.4-.95 1.107-.35 1.72-.35 1.19.117 1.73.35 1.01.55 1.41.95.717.867.95 1.4.35 1.107.35 1.72c0 .24-.087.447-.26.62s-.387.26-.64.26c-.24 0-.447-.087-.62-.26s-.26-.38-.26-.62a2.68 2.68 0 00-.78-1.88 2.683 2.683 0 00-1.88-.78c-.36 0-.7.07-1.02.21s-.6.33-.84.57-.43.523-.57.85S3 8.58 3 8.94c0 .4.083.733.25 1s.403.5.71.7c.32.2.68.38 1.08.54l.64.24.66.24c.44.16.883.343 1.33.55s.847.467 1.2.78.643.703.87 1.17.34 1.04.34 1.72c0 .613-.117 1.187-.35 1.72s-.55 1-.95 1.4-.87.717-1.41.95-1.117.35-1.73.35zm29.443 0c-1.093 0-2.12-.207-3.08-.62s-1.797-.977-2.51-1.69-1.277-1.55-1.69-2.51-.62-1.987-.62-3.08c0-1.08.207-2.1.62-3.06s.977-1.797 1.69-2.51 1.55-1.277 2.51-1.69 1.987-.62 3.08-.62c1.08 0 2.1.207 3.06.62s1.797.977 2.51 1.69 1.277 1.55 1.69 2.51.62 1.98.62 3.06c0 1.093-.207 2.12-.62 3.08s-.977 1.797-1.69 2.51-1.55 1.277-2.51 1.69-1.98.62-3.06.62zm0-14.02c-.84 0-1.633.16-2.38.48s-1.4.757-1.96 1.31a6.071 6.071 0 00-1.8 4.33c0 .84.16 1.633.48 2.38s.76 1.4 1.32 1.96 1.213 1 1.96 1.32 1.54.48 2.38.48 1.633-.16 2.38-.48 1.397-.76 1.95-1.32.99-1.213 1.31-1.96.48-1.54.48-2.38-.16-1.633-.48-2.38-.757-1.397-1.31-1.95-1.203-.99-1.95-1.31-1.54-.48-2.38-.48zm33.223 0h-6v5.18h5.06c.24 0 .447.087.62.26s.26.38.26.62c0 .253-.087.463-.26.63s-.38.25-.62.25h-5.06v6.2c0 .24-.087.447-.26.62s-.38.26-.62.26c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26h6.88c.253 0 .467.087.64.26s.26.38.26.62c0 .253-.087.463-.26.63s-.387.25-.64.25zm24.723 0h-3.24v13.14c0 .24-.087.447-.26.62s-.38.26-.62.26c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V6.28h-3.24c-.24 0-.447-.083-.62-.25s-.26-.377-.26-.63c0-.24.087-.447.26-.62s.38-.26.62-.26h8.26c.24 0 .447.087.62.26s.26.38.26.62c0 .253-.087.463-.26.63s-.38.25-.62.25zm35.283 5.94c-.32.853-.633 1.697-.94 2.53s-.59 1.593-.85 2.28-.477 1.27-.65 1.75l-.34.94c-.067.173-.177.313-.33.42s-.323.16-.51.16-.357-.053-.51-.16-.263-.247-.33-.42l-4.36-11.88-4.38 11.88c-.067.173-.173.313-.32.42s-.313.16-.5.16-.357-.053-.51-.16-.263-.247-.33-.42c-.053-.147-.17-.46-.35-.94s-.397-1.063-.65-1.75l-.84-2.28c-.307-.833-.62-1.677-.94-2.53-.307-.84-.61-1.663-.91-2.47s-.567-1.533-.8-2.18-.42-1.18-.56-1.6-.21-.657-.21-.71c0-.24.087-.447.26-.62s.38-.26.62-.26c.187 0 .357.053.51.16s.263.247.33.42l4.38 11.88 4.36-11.88c.067-.173.177-.313.33-.42s.323-.16.51-.16.353.053.5.16.253.247.32.42l4.38 11.88 4.36-11.88c.067-.173.177-.313.33-.42s.323-.16.51-.16c.24 0 .447.087.62.26s.26.38.26.62c0 .053-.07.29-.21.71s-.327.953-.56 1.6-.497 1.373-.79 2.18l-.9 2.47zm29.443 8a.75.75 0 01-.34.08c-.173 0-.337-.047-.49-.14s-.263-.227-.33-.4l-1.58-3.72h-7.26l-1.58 3.72c-.093.227-.253.387-.48.48s-.453.087-.68-.02c-.227-.093-.387-.253-.48-.48s-.087-.453.02-.68l1.8-4.26 4.22-9.88c.067-.173.173-.307.32-.4s.313-.14.5-.14c.173 0 .333.047.48.14s.253.227.32.4l3.02 7.07 3.02 7.07c.093.227.093.453 0 .68s-.253.387-.48.48zm-6.36-12.68l-2.88 6.72h5.74zm27.983 5.82h-.24l.26-.46 3.62 6.06c.08.147.12.3.12.46 0 .24-.087.447-.26.62s-.38.26-.62.26c-.16 0-.31-.04-.45-.12s-.25-.187-.33-.32l-3.88-6.5h-.86v6.06c0 .24-.087.447-.26.62s-.38.26-.62.26c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26h3.52c.613 0 1.19.117 1.73.35s1.01.55 1.41.95.717.867.95 1.4.35 1.107.35 1.72-.117 1.187-.35 1.72-.55 1-.95 1.4-.87.717-1.41.95-1.117.35-1.73.35zm0-7.08h-2.64v5.3h2.64a2.68 2.68 0 002.45-1.62c.14-.32.21-.66.21-1.02s-.07-.703-.21-1.03-.33-.61-.57-.85-.523-.43-.85-.57-.67-.21-1.03-.21zm28.883 14.02h-6.88c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26h6.88c.253 0 .467.087.64.26s.26.38.26.62c0 .253-.087.463-.26.63s-.387.25-.64.25h-6v5.1h5.06c.24 0 .447.083.62.25s.26.377.26.63c0 .24-.087.447-.26.62s-.38.26-.62.26h-5.06v5.38h6c.253 0 .467.087.64.26s.26.387.26.64c0 .24-.087.447-.26.62s-.387.26-.64.26zm47.186 0h-6.88c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26h6.88c.253 0 .467.087.64.26s.26.38.26.62c0 .253-.087.463-.26.63s-.387.25-.64.25h-6v5.1h5.06c.24 0 .447.083.62.25s.26.377.26.63c0 .24-.087.447-.26.62s-.38.26-.62.26h-5.06v5.38h6c.253 0 .467.087.64.26s.26.387.26.64c0 .24-.087.447-.26.62s-.387.26-.64.26zm27.463 0a.84.84 0 01-.76-.42l-7.22-11.44v10.98c0 .24-.083.447-.25.62s-.377.26-.63.26c-.24 0-.447-.087-.62-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.38-.26.62-.26c.333 0 .587.133.76.4l7.22 11.44V5.4c0-.24.083-.447.25-.62s.377-.26.63-.26c.24 0 .447.087.62.26s.26.38.26.62v14.02c0 .24-.087.447-.26.62s-.38.26-.62.26zm29.383 0c-.24 0-.447-.087-.62-.26s-.26-.38-.26-.62v-6.78h-7.86v6.78c0 .24-.087.447-.26.62s-.38.26-.62.26c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26c.24 0 .447.087.62.26s.26.38.26.62v5.46h7.86V5.4c0-.24.087-.447.26-.62s.38-.26.62-.26c.253 0 .467.087.64.26s.26.38.26.62v14.02c0 .24-.087.447-.26.62s-.387.26-.64.26zm30.843-.08a.75.75 0 01-.34.08c-.173 0-.337-.047-.49-.14s-.263-.227-.33-.4l-1.58-3.72h-7.26l-1.58 3.72c-.093.227-.253.387-.48.48s-.453.087-.68-.02c-.227-.093-.387-.253-.48-.48s-.087-.453.02-.68l1.8-4.26 4.22-9.88c.067-.173.173-.307.32-.4s.313-.14.5-.14c.173 0 .333.047.48.14s.253.227.32.4l3.02 7.07 3.02 7.07c.093.227.093.453 0 .68s-.253.387-.48.48zm-6.36-12.68l-2.88 6.72h5.74zm33.303 12.76a.84.84 0 01-.76-.42l-7.22-11.44v10.98c0 .24-.083.447-.25.62s-.377.26-.63.26c-.24 0-.447-.087-.62-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.38-.26.62-.26c.333 0 .587.133.76.4l7.22 11.44V5.4c0-.24.083-.447.25-.62s.377-.26.63-.26c.24 0 .447.087.62.26s.26.38.26.62v14.02c0 .24-.087.447-.26.62s-.38.26-.62.26zm26.403 0c-1.107 0-2.143-.21-3.11-.63s-1.81-.99-2.53-1.71-1.29-1.563-1.71-2.53-.63-2.003-.63-3.11c0-1.093.21-2.117.63-3.07s.99-1.78 1.71-2.48 1.563-1.25 2.53-1.65 2.003-.6 3.11-.6c1.067 0 2.08.197 3.04.59s1.82.97 2.58 1.73c.187.187.28.4.28.64s-.093.447-.28.62c-.173.173-.38.26-.62.26s-.447-.087-.62-.26c-.6-.6-1.273-1.053-2.02-1.36s-1.533-.46-2.36-.46c-.867 0-1.677.157-2.43.47s-1.41.74-1.97 1.28-1 1.177-1.32 1.91-.48 1.527-.48 2.38.163 1.657.49 2.41.77 1.41 1.33 1.97 1.217 1.003 1.97 1.33 1.557.49 2.41.49c.827 0 1.613-.153 2.36-.46s1.42-.753 2.02-1.34c.173-.187.38-.28.62-.28s.447.093.62.28c.187.173.28.38.28.62s-.093.447-.28.62c-.76.76-1.62 1.34-2.58 1.74s-1.973.6-3.04.6zm31.223 0h-6.88c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26h6.88c.253 0 .467.087.64.26s.26.38.26.62c0 .253-.087.463-.26.63s-.387.25-.64.25h-6v5.1h5.06c.24 0 .447.083.62.25s.26.377.26.63c0 .24-.087.447-.26.62s-.38.26-.62.26h-5.06v5.38h6c.253 0 .467.087.64.26s.26.387.26.64c0 .24-.087.447-.26.62s-.387.26-.64.26zm44.566 0h-4.26c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26h2.92a3.703 3.703 0 012.62 1.08 3.706 3.706 0 011.08 2.62c0 .8-.24 1.533-.72 2.2.52.173.993.41 1.42.71s.793.657 1.1 1.07.547.87.72 1.37.26 1.03.26 1.59a5.143 5.143 0 01-1.5 3.64 5.14 5.14 0 01-3.64 1.5zm-1.34-14.02h-2.04v3.86h2.24c.213 0 .423-.057.63-.17s.39-.26.55-.44.29-.383.39-.61.15-.46.15-.7c0-.267-.05-.517-.15-.75s-.237-.44-.41-.62-.377-.32-.61-.42-.483-.15-.75-.15zm1.34 5.64h-3.38v6.6h3.38c.467 0 .903-.087 1.31-.26a3.353 3.353 0 002.05-3.1c0-.467-.09-.9-.27-1.3s-.42-.743-.72-1.03-.657-.51-1.07-.67-.847-.24-1.3-.24zm28.323 8.38c-.84 0-1.627-.16-2.36-.48s-1.377-.753-1.93-1.3-.99-1.19-1.31-1.93-.48-1.53-.48-2.37V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26c.24 0 .447.087.62.26s.26.38.26.62v8.82c0 .6.113 1.16.34 1.68s.533.973.92 1.36.843.693 1.37.92 1.083.34 1.67.34c.6 0 1.16-.113 1.68-.34s.977-.533 1.37-.92.703-.843.93-1.37.34-1.083.34-1.67V5.4c0-.24.087-.447.26-.62s.38-.26.62-.26c.253 0 .467.087.64.26s.26.38.26.62v8.82c0 .84-.16 1.63-.48 2.37s-.757 1.383-1.31 1.93-1.2.98-1.94 1.3-1.53.48-2.37.48zm28.063 0c-.613 0-1.187-.117-1.72-.35s-1-.55-1.4-.95-.717-.867-.95-1.4-.35-1.107-.35-1.72c0-.253.087-.467.26-.64s.387-.26.64-.26c.24 0 .447.087.62.26s.26.387.26.64c0 .36.07.7.21 1.02s.33.6.57.84.52.43.84.57.66.21 1.02.21.703-.07 1.03-.21.61-.33.85-.57.43-.52.57-.84.21-.66.21-1.02c0-.44-.087-.803-.26-1.09s-.413-.537-.72-.75c-.147-.107-.313-.203-.5-.29l-.58-.27a30.59 30.59 0 00-1.28-.48c-.44-.16-.883-.34-1.33-.54s-.847-.45-1.2-.75-.643-.673-.87-1.12-.34-.997-.34-1.65c0-.613.117-1.187.35-1.72s.55-1 .95-1.4.867-.717 1.4-.95 1.107-.35 1.72-.35 1.19.117 1.73.35 1.01.55 1.41.95.717.867.95 1.4.35 1.107.35 1.72c0 .24-.087.447-.26.62s-.387.26-.64.26c-.24 0-.447-.087-.62-.26s-.26-.38-.26-.62a2.68 2.68 0 00-.78-1.88 2.683 2.683 0 00-1.88-.78c-.36 0-.7.07-1.02.21s-.6.33-.84.57-.43.523-.57.85-.21.67-.21 1.03c0 .4.083.733.25 1s.403.5.71.7c.32.2.68.38 1.08.54l.64.24.66.24c.44.16.883.343 1.33.55s.847.467 1.2.78.643.703.87 1.17.34 1.04.34 1.72c0 .613-.117 1.187-.35 1.72s-.55 1-.95 1.4-.87.717-1.41.95-1.117.35-1.73.35zm22.883 0c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26c.24 0 .447.087.62.26s.26.38.26.62v14.02c0 .24-.087.447-.26.62s-.38.26-.62.26zm28.603 0a.84.84 0 01-.76-.42l-7.22-11.44v10.98c0 .24-.083.447-.25.62s-.377.26-.63.26c-.24 0-.447-.087-.62-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.38-.26.62-.26c.333 0 .587.133.76.4l7.22 11.44V5.4c0-.24.083-.447.25-.62s.377-.26.63-.26c.24 0 .447.087.62.26s.26.38.26.62v14.02c0 .24-.087.447-.26.62s-.38.26-.62.26zm26.643 0h-6.88c-.253 0-.467-.087-.64-.26s-.26-.38-.26-.62V5.4c0-.24.087-.447.26-.62s.387-.26.64-.26h6.88c.253 0 .467.087.64.26s.26.38.26.62c0 .253-.087.463-.26.63s-.387.25-.64.25h-6v5.1h5.06c.24 0 .447.083.62.25s.26.377.26.63c0 .24-.087.447-.26.62s-.38.26-.62.26h-5.06v5.38h6c.253 0 .467.087.64.26s.26.387.26.64c0 .24-.087.447-.26.62s-.387.26-.64.26zm21.703 0c-.613 0-1.187-.117-1.72-.35s-1-.55-1.4-.95-.717-.867-.95-1.4-.35-1.107-.35-1.72c0-.253.087-.467.26-.64s.387-.26.64-.26c.24 0 .447.087.62.26s.26.387.26.64c0 .36.07.7.21 1.02s.33.6.57.84.52.43.84.57.66.21 1.02.21.703-.07 1.03-.21.61-.33.85-.57.43-.52.57-.84.21-.66.21-1.02c0-.44-.087-.803-.26-1.09s-.413-.537-.72-.75c-.147-.107-.313-.203-.5-.29l-.58-.27a30.59 30.59 0 00-1.28-.48c-.44-.16-.883-.34-1.33-.54s-.847-.45-1.2-.75-.643-.673-.87-1.12-.34-.997-.34-1.65c0-.613.117-1.187.35-1.72s.55-1 .95-1.4.867-.717 1.4-.95 1.107-.35 1.72-.35 1.19.117 1.73.35 1.01.55 1.41.95.717.867.95 1.4.35 1.107.35 1.72c0 .24-.087.447-.26.62s-.387.26-.64.26c-.24 0-.447-.087-.62-.26s-.26-.38-.26-.62a2.68 2.68 0 00-.78-1.88 2.683 2.683 0 00-1.88-.78c-.36 0-.7.07-1.02.21s-.6.33-.84.57-.43.523-.57.85-.21.67-.21 1.03c0 .4.083.733.25 1s.403.5.71.7c.32.2.68.38 1.08.54l.64.24.66.24c.44.16.883.343 1.33.55s.847.467 1.2.78.643.703.87 1.17.34 1.04.34 1.72c0 .613-.117 1.187-.35 1.72s-.55 1-.95 1.4-.87.717-1.41.95-1.117.35-1.73.35zm25.963 0c-.613 0-1.187-.117-1.72-.35s-1-.55-1.4-.95-.717-.867-.95-1.4-.35-1.107-.35-1.72c0-.253.087-.467.26-.64s.387-.26.64-.26c.24 0 .447.087.62.26s.26.387.26.64c0 .36.07.7.21 1.02s.33.6.57.84.52.43.84.57.66.21 1.02.21.703-.07 1.03-.21.61-.33.85-.57.43-.52.57-.84.21-.66.21-1.02c0-.44-.087-.803-.26-1.09s-.413-.537-.72-.75c-.147-.107-.313-.203-.5-.29l-.58-.27a30.59 30.59 0 00-1.28-.48c-.44-.16-.883-.34-1.33-.54s-.847-.45-1.2-.75-.643-.673-.87-1.12-.34-.997-.34-1.65c0-.613.117-1.187.35-1.72s.55-1 .95-1.4.867-.717 1.4-.95 1.107-.35 1.72-.35 1.19.117 1.73.35 1.01.55 1.41.95.717.867.95 1.4.35 1.107.35 1.72c0 .24-.087.447-.26.62s-.387.26-.64.26c-.24 0-.447-.087-.62-.26s-.26-.38-.26-.62a2.68 2.68 0 00-.78-1.88 2.683 2.683 0 00-1.88-.78c-.36 0-.7.07-1.02.21s-.6.33-.84.57-.43.523-.57.85-.21.67-.21 1.03c0 .4.083.733.25 1s.403.5.71.7c.32.2.68.38 1.08.54l.64.24.66.24c.44.16.883.343 1.33.55s.847.467 1.2.78.643.703.87 1.17.34 1.04.34 1.72c0 .613-.117 1.187-.35 1.72s-.55 1-.95 1.4-.87.717-1.41.95-1.117.35-1.73.35z"
        transform="matrix(.42574 0 0 .42574 34.48 67.135)"
      ></path>
    </svg>
  ),
  tinder: ({ ...props }: LucideProps) => (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.3675 17.64C14.3325 17.64 14.2975 17.64 14.2625 17.605C13.09 16.03 12.7925 13.335 12.705 12.3025C12.705 12.11 12.4775 11.9875 12.3025 12.0925C8.6275 14.14 5.25 19.005 5.25 23.695C5.25 31.745 10.85 38.5 20.475 38.5C29.4875 38.5 35.7 31.535 35.7 23.695C35.7 13.4225 28.35 6.59751 21.8225 3.51751C21.7844 3.49657 21.7412 3.48698 21.6978 3.48985C21.6545 3.49272 21.6129 3.50793 21.5779 3.5337C21.5429 3.55947 21.5161 3.5947 21.5005 3.63525C21.4849 3.6758 21.4813 3.71995 21.49 3.76251C22.33 9.29251 21.175 15.3125 14.3675 17.64Z"
        fill="url(#paint0_linear_3_239)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3_239"
          x1="8.16"
          y1="6.6"
          x2="29.4"
          y2="33.6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF3863" />
          <stop offset="1" stopColor="#FF5E51" />
        </linearGradient>
      </defs>
    </svg>
  ),
  tinderUnlike: ({ ...props }: LucideProps) => (
    <svg
      width="62"
      height="62"
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="31" cy="31" r="30" stroke="#FF5E51" strokeWidth="2" />
      <path
        d="M34.5854 31.277C34.5488 31.2407 34.5198 31.1976 34.5 31.15C34.4802 31.1025 34.47 31.0515 34.47 31C34.47 30.9485 34.4802 30.8975 34.5 30.85C34.5198 30.8024 34.5488 30.7593 34.5854 30.723L42.314 22.9983C42.5315 22.7808 42.704 22.5226 42.8217 22.2384C42.9394 21.9543 43 21.6497 43 21.3421C43 21.0346 42.9394 20.73 42.8217 20.4458C42.704 20.1617 42.5315 19.9035 42.314 19.686C42.0965 19.4685 41.8383 19.296 41.5542 19.1783C41.27 19.0606 40.9654 19 40.6579 19C40.0367 19 39.441 19.2468 39.0017 19.686L31.277 27.4107C31.2407 27.4473 31.1976 27.4763 31.15 27.4961C31.1025 27.5159 31.0515 27.5261 31 27.5261C30.9485 27.5261 30.8975 27.5159 30.85 27.4961C30.8024 27.4763 30.7593 27.4473 30.723 27.4107L22.9983 19.686C22.559 19.2468 21.9633 19 21.3421 19C20.721 19 20.1252 19.2468 19.686 19.686C19.2468 20.1252 19 20.721 19 21.3421C19 21.9633 19.2468 22.559 19.686 22.9983L27.4107 30.723C27.4473 30.7593 27.4763 30.8024 27.4961 30.85C27.5159 30.8975 27.5261 30.9485 27.5261 31C27.5261 31.0515 27.5159 31.1025 27.4961 31.15C27.4763 31.1976 27.4473 31.2407 27.4107 31.277L19.686 39.0017C19.2468 39.441 19 40.0367 19 40.6579C19 41.279 19.2468 41.8748 19.686 42.314C20.1252 42.7532 20.721 43 21.3421 43C21.9633 43 22.559 42.7532 22.9983 42.314L30.723 34.5893C30.7593 34.5527 30.8024 34.5237 30.85 34.5039C30.8975 34.4841 30.9485 34.4739 31 34.4739C31.0515 34.4739 31.1025 34.4841 31.15 34.5039C31.1976 34.5237 31.2407 34.5527 31.277 34.5893L39.0017 42.314C39.441 42.7532 40.0367 43 40.6579 43C41.279 43 41.8748 42.7532 42.314 42.314C42.7532 41.8748 43 41.279 43 40.6579C43 40.0367 42.7532 39.441 42.314 39.0017L34.5854 31.277Z"
        fill="#FF5E51"
      />
    </svg>
  ),
  tinderSuperLike: ({ ...props }: LucideProps) => (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="21" cy="21" r="20" stroke="#07A6FF" strokeWidth="2" />
      <g clipPath="url(#clip0_17_100)">
        <path
          d="M29.5223 18.4334L23.9888 17.5882L21.5086 12.3052C21.3233 11.9107 20.6761 11.9107 20.4908 12.3052L18.0113 17.5882L12.4778 18.4334C12.0233 18.5032 11.8418 19.0559 12.1606 19.3822L16.1806 23.5027L15.2303 29.3279C15.1546 29.7907 15.6488 30.1379 16.0576 29.9107L21.0001 27.1792L25.9426 29.9114C26.3476 30.1364 26.8463 29.7959 26.7698 29.3287L25.8196 23.5034L29.8396 19.3829C30.1583 19.0559 29.9761 18.5032 29.5223 18.4334Z"
          fill="#07A6FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_17_100">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(12 12)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  tinderLike: ({ ...props }: LucideProps) => (
    <svg
      width="62"
      height="62"
      viewBox="0 0 62 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="31" cy="31" r="30" stroke="#00D387" strokeWidth="2" />
      <path
        d="M37.9893 19.0142C33.2178 19.0142 31.2012 22.3799 31.2012 22.3799C31.2012 22.3799 29.1846 19 24.413 19C20.3799 19.0142 17 22.3799 17 26.3988C17 35.6154 31.2012 43 31.2012 43C31.2012 43 45.4024 35.6154 45.4024 26.3988C45.4024 22.3799 42.0225 19.0142 37.9893 19.0142Z"
        fill="#00D387"
      />
    </svg>
  ),
  twitter: Twitter,
  check: Check,
};

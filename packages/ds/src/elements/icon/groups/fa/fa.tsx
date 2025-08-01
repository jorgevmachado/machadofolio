import React from 'react';

import {
  FaAnchor,
  FaAndroid,
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaAngleUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight, FaArrowUp,
  FaBatteryFull,
  FaBed,
  FaBluetooth,
  FaBolt,
  FaBook,
  FaBookmark,
  FaBox,
  FaBrush,
  FaCamera,
  FaChair,
  FaChargingStation,
  FaCheck,
  FaChurch,
  FaCloud,
  FaCode,
  FaCog,
  FaComment,
  FaCompress,
  FaCookie,
  FaCreditCard,
  FaDownload,
  FaEdit,
  FaEgg,
  FaEject,
  FaExpand,
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaFilter,
  FaFingerprint,
  FaFireExtinguisher,
  FaFlag,
  FaFolder,
  FaFolderOpen,
  FaForward,
  FaGamepad,
  FaGavel,
  FaGoogle,
  FaHamburger,
  FaHandshake,
  FaHeadphones,
  FaHome,
  FaHotel,
  FaImage,
  FaInbox,
  FaInfo,
  FaKey,
  FaKeyboard,
  FaLaptop,
  FaLayerGroup,
  FaLightbulb,
  FaLink,
  FaList,
  FaLock,
  FaLockOpen,
  FaMap,
  FaMoneyCheckAlt,
  FaPalette,
  FaPause,
  FaPhone,
  FaPowerOff,
  FaPrint,
  FaReact,
  FaReceipt,
  FaRegCalendarAlt,
  FaRegHeart,
  FaRegLightbulb,
  FaRegNewspaper,
  FaRegTimesCircle,
  FaRegTrashAlt,
  FaReply,
  FaReplyAll,
  FaRocket,
  FaRoute,
  FaSchool,
  FaShareAlt,
  FaShower, FaSignInAlt,
  FaSignOutAlt,
  FaSort,
  FaStar,
  FaStarHalfAlt,
  FaStop,
  FaStore,
  FaTabletAlt,
  FaTag,
  FaTerminal,
  FaTrain,
  FaTransgender,
  FaTv,
  FaUmbrella,
  FaUpload,
  FaUser,
  FaUserTie,
  FaVolumeOff,
  FaWallet,
  FaWarehouse,
} from 'react-icons/fa';

import type { TIconGroupIcons } from '../types';

export const faGroup: TIconGroupIcons = {
  tv: <FaTv />,
  box: <FaBox />,
  tag: <FaTag />,
  key: <FaKey />,
  map: <FaMap />,
  egg: <FaEgg />,
  eye: <FaEye />,
  bed: <FaBed />,
  user: <FaUser />,
  edit: <FaEdit />,
  lamp: <FaRegLightbulb />,
  star: undefined,
  bolt: <FaBolt />,
  book: <FaBook />,
  info: <FaInfo />,
  code: <FaCode />,
  like: <FaRegHeart />,
  exit: undefined,
  flag: <FaFlag />,
  link: <FaLink />,
  list: <FaList />,
  lock: <FaLock />,
  sort: <FaSort />,
  stop: <FaStop />,
  home: <FaHome />,
  trash: <FaRegTrashAlt />,
  group: <FaLayerGroup />,
  brush: <FaBrush />,
  chair: <FaChair />,
  check: <FaCheck />,
  close: <FaRegTimesCircle />,
  react: <FaReact />,
  phone: <FaPhone />,
  cloud: <FaCloud />,
  hotel: <FaHotel />,
  image: <FaImage />,
  inbox: <FaInbox />,
  gavel: <FaGavel />,
  eject: <FaEject />,
  pause: <FaPause />,
  print: <FaPrint />,
  store: <FaStore />,
  reply: <FaReply />,
  train: <FaTrain />,
  route: <FaRoute />,
  share: <FaShareAlt />,
  config: <FaCog />,
  church: <FaChurch />,
  google: <FaGoogle />,
  camera: <FaCamera />,
  anchor: <FaAnchor />,
  folder: <FaFolder />,
  expand: <FaExpand />,
  filter: <FaFilter />,
  cookie: <FaCookie />,
  laptop: <FaLaptop />,
  wallet: <FaWallet />,
  upload: <FaUpload />,
  school: <FaSchool />,
  rocket: <FaRocket />,
  shower: <FaShower />,
  tablet: <FaTabletAlt />,
  android: <FaAndroid />,
  forward: <FaForward />,
  comment: <FaComment />,
  gamepad: <FaGamepad />,
  palette: <FaPalette />,
  receipt: <FaReceipt />,
  confirm: undefined,
  warning: undefined,
  expense: <FaMoneyCheckAlt />,
  category: undefined,
  'user-tie': <FaUserTie />,
  'arrow-up': <FaArrowUp/>,
  facebook: <FaFacebook />,
  calendar: <FaRegCalendarAlt />,
  document: undefined,
  bookmark: <FaBookmark />,
  compress: <FaCompress />,
  terminal: <FaTerminal />,
  download: <FaDownload />,
  keyboard: <FaKeyboard />,
  umbrella: <FaUmbrella />,
  'sign-in': <FaSignInAlt />,
  'sign-out': <FaSignOutAlt />,
  warehouse: <FaWarehouse />,
  lightbulb: <FaLightbulb />,
  'lock-open': <FaLockOpen />,
  handshake: <FaHandshake />,
  'power-off': <FaPowerOff />,
  'reply-all': <FaReplyAll />,
  newspaper: <FaRegNewspaper />,
  'star-half': <FaStarHalfAlt />,
  bluetooth: <FaBluetooth />,
  dashboard: undefined,
  hamburger: <FaHamburger />,
  'eye-close': <FaEyeSlash />,
  'arrow-down': <FaArrowDown />,
  'arrow-left': <FaArrowLeft />,
  headphones: <FaHeadphones />,
  'volume-off': <FaVolumeOff />,
  transgender: <FaTransgender />,
  'folder-open': <FaFolderOpen />,
  'credit-card': <FaCreditCard />,
  fingerprint: <FaFingerprint />,
  'arrow-right': <FaArrowRight />,
  'battery-full': <FaBatteryFull />,
  'star-filled': <FaStar />,
  'chevron-up': <FaAngleUp />,
  'chevron-left': <FaAngleLeft />,
  'chevron-down': <FaAngleDown />,
  'chevron-right': <FaAngleRight />,
  'arrow-up-outline': undefined,
  'charging-station': <FaChargingStation />,
  'arrow-down-outline': undefined,
  'fire-extinguisher': <FaFireExtinguisher />,
};
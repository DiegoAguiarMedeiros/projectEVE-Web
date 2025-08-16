import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

import SavingsIcon from "@mui/icons-material/Savings";
import CallMadeIcon from "@mui/icons-material/CallMade";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import {
  _id,
  _price,
  _times,
  _company,
  _boolean,
  _fullName,
  _taskNames,
  _postTitles,
  _description,
  _productNames,
  _amount,
} from "./_mock";

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: "Jaydon Frankie",
  email: "demo@minimals.cc",
  photoURL: "/assets/images/avatar/avatar-25.webp",
};

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index),
  company: _company(index),
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  status: index % 4 ? "active" : "banned",
  role:
    [
      "Leader",
      "Hr Manager",
      "UI Designer",
      "UX Designer",
      "UI/UX Designer",
      "Project Manager",
      "Backend Developer",
      "Full Stack Designer",
      "Front End Developer",
      "Full Stack Developer",
    ][index] || "UI Designer",
}));
export const _incomes = [...Array(25)].map((_, index) => ({
  id: _id(index),
  description: _fullName(index),
  amount: [
    2500,
    3000,
    6000
  ][index] || 6000,
  payDay: 5,
  
}));

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index),
  description: _description(index),
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`,
  totalViews: 8829,
  totalComments: 7977,
  totalShares: 8556,
  totalFavorites: 8870,
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------

const COLORS = [
  "#00AB55",
  "#000000",
  "#F5F5F5",
  "#FFC0CB",
  "#FF4842",
  "#1890FF",
  "#94D82D",
  "#FFC107",
];

export const _products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    price: _price(index),
    name: _productNames(index),
    priceSale: setIndex % 3 ? null : _price(index),
    coverUrl: `/assets/images/product/product-${setIndex}.webp`,
    colors:
      (setIndex === 1 && COLORS.slice(0, 2)) ||
      (setIndex === 2 && COLORS.slice(1, 3)) ||
      (setIndex === 3 && COLORS.slice(2, 4)) ||
      (setIndex === 4 && COLORS.slice(3, 6)) ||
      (setIndex === 23 && COLORS.slice(4, 6)) ||
      (setIndex === 24 && COLORS.slice(5, 6)) ||
      COLORS,
    status:
      ([1, 3, 5].includes(setIndex) && "sale") || ([4, 8, 12].includes(setIndex) && "new") || "",
  };
});

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: "br",
    label: "Brasil",
    icon: "/assets/icons/flags/ic-flag-br.svg",
  },
  {
    value: "en",
    label: "Inglês",
    icon: "/assets/icons/flags/ic-flag-en.svg",
  },
  {
    value: "fr",
    label: "Espanhol",
    icon: "/assets/icons/flags/ic-flag-es.svg",
  },
];

// ----------------------------------------------------------------------

export const _timeline: {
  title: string;
  value: number;
  valueMax: number;
  color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}[] = [
  {
    title: "Contas Fixas",
    value: 250,
    valueMax: 500,
    color: "primary",
  },
  {
    title: "Alimentação",
    value: 350,
    valueMax: 500,
    color: "secondary",
  },
  {
    title: "Lazer",
    value: 450,
    valueMax: 500,
    color: "info",
  },
  {
    title: "Transporte",
    value: 50,
    valueMax: 500,
    color: "warning",
  },
  {
    title: "Saúde",
    value: 100,
    valueMax: 500,
    color: "success",
  },
  {
    title: "Bem Estar",
    value: 300,
    valueMax: 500,
    color: "error",
  },
];

// ----------------------------------------------------------------------

export const _tasks = [...Array(5)].map((_, index) => ({
  id: _id(index),
  name: _taskNames(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: "Your order is placed",
    description: "waiting for shipping",
    avatarUrl: null,
    type: "order-placed",
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: _fullName(2),
    description: "answered to your comment on the Minimal",
    avatarUrl: "/assets/images/avatar/avatar-2.webp",
    type: "friend-interactive",
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: "You have new message",
    description: "5 unread messages",
    avatarUrl: null,
    type: "chat-message",
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: "You have new mail",
    description: "sent from Guido Padberg",
    avatarUrl: null,
    type: "mail",
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: "Delivery processing",
    description: "Your order is being shipped",
    avatarUrl: null,
    type: "order-shipped",
    postedAt: _times(5),
    isUnRead: false,
  },
];
interface MockDataItem {
  title: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  percent: number;
  total: number;
  color: "primary" | "secondary" | "info" | "warning" | "success" | "error";
}

export const _inout: MockDataItem[] = [
  {
    title: "Minha Renda",
    icon: CallMadeIcon,
    color: "primary",
    percent: 42.3,
    total: 3200,
  },
  {
    title: "Metas",
    icon: SavingsIcon,
    color: "info",
    percent: 90.0,
    total: 4500,
  },
  {
    title: "Gastos",
    icon: SouthEastIcon,
    color: "error",
    percent: 69.5,
    total: 5000,
  },
  {
    title: "Saldo",
    icon: AttachMoneyIcon,
    color: "success",
    percent: 69.5,
    total: 5000,
  },
];
export const _envelopes: MockDataItem[] = [
  {
    title: "Contas Fixas",
    icon: ShoppingBagIcon,
    color: "primary",
    percent: 42.3,
    total: 3200,
  },
  {
    title: "Alimentação",
    icon: ShoppingBagIcon,
    color: "secondary",
    percent: 69.5,
    total: 5000,
  },
  {
    title: "Lazer",
    icon: ShoppingBagIcon,
    color: "info",
    percent: 90.0,
    total: 4500,
  },
  {
    title: "Transporte",
    icon: ShoppingBagIcon,
    color: "warning",
    percent: 30.0,
    total: 1500,
  },
  {
    title: "Saúde",
    icon: ShoppingBagIcon,
    color: "success",
    percent: 52.0,
    total: 4000,
  },
  {
    title: "Bem Estar",
    icon: ShoppingBagIcon,
    color: "error",
    percent: 77.5,
    total: 3500,
  },
];

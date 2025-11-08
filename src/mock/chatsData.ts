interface ChatData {
  id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isLastMessageFromMe?: boolean;
  isSelected?: boolean;
}

export const chatsData: ChatData[] = [
  {
    id: 1,
    name: 'Андрей',
    lastMessage: 'Я готов помочь',
    time: '12:02',
    isLastMessageFromMe: true,
    isSelected: true,
  },
  {
    id: 2,
    name: 'Киноклуб',
    lastMessage: 'Стикер',
    time: '12:00',
  },
  {
    id: 3,
    name: 'Илья',
    lastMessage: 'Друзья, у меня для вас особенный выпуск новостей!',
    time: '15:12',
    unreadCount: 4,
  },
  {
    id: 4,
    name: 'Вадим',
    lastMessage: 'Круто!',
    time: 'Пт',
    isLastMessageFromMe: true,
  },
  {
    id: 5,
    name: 'тет-а-теты',
    lastMessage: 'И Human Interface Guidelines и Material Design рекомендуют использовать единообразные паттерны взаимодействия для создания интуитивно понятного пользовательского интерфейса, который будет удобен для всех категорий пользователей независимо от их уровня технической подготовки',
    time: 'Ср',
  },
  {
    id: 6,
    name: '1, 2, 3',
    lastMessage: 'Миллионы россиян ежедневно проводят десятки часов своего свободного времени в социальных сетях, просматривая ленты новостей, общаясь с друзьями и знакомыми, делясь фотографиями и видео, участвуя в обсуждениях различных тем и событий',
    time: 'Пн',
  },
  {
    id: 7,
    name: 'Design Destroyer',
    lastMessage: 'В 2008 году художник Jon Rafman начал собирать скриншоты из Google Street View, создавая уникальную коллекцию случайных моментов повседневной жизни, запечатленных уличными камерами по всему миру, что стало основой для его художественного проекта',
    time: 'Пн',
  },
  {
    id: 8,
    name: 'Day.',
    lastMessage: 'Так увлёкся работой по курсу, что совсем забыл анонс',
    time: '1 Мая 2020',
  },
  {
    id: 9,
    name: 'Стас Рогозин',
    lastMessage: 'Можно или сегодня или завтра вечером.',
    time: '12 Апр 2020',
  },
  {
    id: 10,
    name: 'Мария',
    lastMessage: 'Привет! Как дела?',
    time: 'Вчера',
    unreadCount: 1,
  },
  {
    id: 11,
    name: 'Алексей',
    lastMessage: 'Спасибо за помощь!',
    time: 'Вс',
    isLastMessageFromMe: true,
  },
];


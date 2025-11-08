interface Message {
  id: number;
  isFromMe: boolean;
  content: string;
  time: string;
  date: string;
  showDate?: boolean;
  isRead?: boolean;
}

interface DialogData {
  name: string;
  avatar?: string;
  messages: Message[];
}

const messagesData: Message[] = [
  {
    id: 5,
    isFromMe: true,
    content: 'Я готов помочь',
    time: '12:02',
    date: '19 июня',
    isRead: false,
  },
  {
    id: 4,
    isFromMe: true,
    content: 'Конечно, спрашивай!',
    time: '12:01',
    date: '19 июня',
    isRead: true,
  },
  {
    id: 3,
    isFromMe: false,
    content: 'Отлично! Хотел спросить про проект. Дело в том, что у нас возникли некоторые сложности с реализацией функционала, и нам нужна помощь в решении нескольких технических вопросов. Мы работаем над созданием современного веб-приложения, которое должно быть масштабируемым, быстрым и удобным для пользователей. В процессе разработки мы столкнулись с необходимостью оптимизации производительности и улучшения пользовательского опыта. Было бы здорово, если бы ты мог поделиться своим опытом и помочь нам найти оптимальные решения для этих задач.',
    time: '12:00',
    date: '19 июня',
  },
  {
    id: 6,
    isFromMe: false,
    content: 'Можешь помочь?',
    time: '12:01',
    date: '19 июня',
  },
  {
    id: 2,
    isFromMe: true,
    content: 'Привет! Всё отлично, спасибо!',
    time: '11:57',
    date: '19 июня',
    isRead: true,
  },
  {
    id: 1,
    isFromMe: false,
    content: 'Привет! Как дела?',
    time: '11:56',
    date: '18 июня',
  },
];

const messagesWithDates = messagesData.map((message, index) => {
  const previousMessage = index > 0 ? messagesData[index - 1] : null;
  return {
    ...message,
    showDate: !previousMessage || previousMessage.date !== message.date,
  };
});

export const dialogData: DialogData = {
  name: 'Андрей',
  messages: messagesWithDates,
};


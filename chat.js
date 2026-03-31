/* ============================
   قطرة حياة — chat.js
   Chat & Notifications System
   ============================ */

// ===== CHAT STATE =====
const ChatSystem = {
  messages: JSON.parse(localStorage.getItem('qh_messages') || '[]'),
  notifications: JSON.parse(localStorage.getItem('qh_notifications') || '[]'),
  currentChat: null,
  unreadCount: 0,

  init() {
    this.renderChatList();
    this.renderNotifications();
    this.updateBadge();
    this.startPolling();
  },

  // Generate a chat ID between two users
  getChatId(user1, user2) {
    return [user1, user2].sort().join('_');
  },

  // Send a message
  sendMessage(senderId, senderName, receiverId, receiverName, text) {
    if (!text.trim()) return;

    const msg = {
      id: generateId(),
      chatId: this.getChatId(senderId, receiverId),
      senderId,
      senderName,
      receiverId,
      receiverName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      flagged: false,
      read: false
    };

    this.messages.push(msg);
    this.saveMessages();

    // Log to sheets
    SheetsAPI.logChatMessage({
      sender_id: senderId,
      sender_name: senderName,
      receiver_id: receiverId,
      receiver_name: receiverName,
      message: text
    });

    // Auto flag suspicious content
    const flagWords = ['مواد', 'مخدر', 'ابتزاز', 'تهديد', 'مال', 'دفع', 'drugs', 'money', 'pay', 'threat'];
    if (flagWords.some(w => text.toLowerCase().includes(w))) {
      msg.flagged = true;
      this.saveMessages();
      this.addNotification({
        type: 'alert',
        title: '⚠️ رسالة مشبوهة',
        desc: `رسالة مشبوهة من ${senderName}: "${text.substring(0, 50)}..."`,
        userId: 'ADMIN001'
      });
    }

    this.renderCurrentChat();
    this.renderChatList();
    return msg;
  },

  // Get messages for a chat
  getMessages(user1, user2) {
    const chatId = this.getChatId(user1, user2);
    return this.messages.filter(m => m.chatId === chatId);
  },

  // Get all chats for a user (sidebar list)
  getChatsForUser(userId) {
    const chatMap = {};
    this.messages.forEach(msg => {
      if (msg.senderId === userId || msg.receiverId === userId) {
        const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const otherName = msg.senderId === userId ? msg.receiverName : msg.senderName;
        if (!chatMap[otherId]) {
          chatMap[otherId] = { id: otherId, name: otherName, lastMsg: '', time: '' };
        }
        chatMap[otherId].lastMsg = msg.text;
        chatMap[otherId].time = msg.timestamp;
        chatMap[otherId].unread = msg.receiverId === userId && !msg.read;
      }
    });
    return Object.values(chatMap);
  },

  // Get ALL chats (for admin)
  getAllChats() {
    const chatMap = {};
    this.messages.forEach(msg => {
      if (!chatMap[msg.chatId]) {
        chatMap[msg.chatId] = {
          id: msg.chatId,
          user1Name: msg.senderName,
          user2Name: msg.receiverName,
          lastMsg: '',
          time: '',
          flagged: false
        };
      }
      chatMap[msg.chatId].lastMsg = msg.text;
      chatMap[msg.chatId].time = msg.timestamp;
      if (msg.flagged) chatMap[msg.chatId].flagged = true;
    });
    return Object.values(chatMap);
  },

  // Mark messages as read
  markRead(chatId, userId) {
    this.messages.forEach(msg => {
      if (msg.chatId === chatId && msg.receiverId === userId) {
        msg.read = true;
      }
    });
    this.saveMessages();
    this.updateBadge();
  },

  // Add notification
  addNotification(notif) {
    const notification = {
      id: generateId(),
      type: notif.type || 'info',
      title: notif.title,
      desc: notif.desc,
      userId: notif.userId,
      read: false,
      timestamp: new Date().toISOString()
    };

    this.notifications.push(notification);
    this.saveNotifications();
    this.updateBadge();
    this.renderNotifications();

    // Log to sheets
    SheetsAPI.logNotification({
      user_id: notif.userId,
      user_name: notif.userId,
      message: `${notif.title}: ${notif.desc}`,
      type: notif.type
    });
  },

  // Get notifications for user
  getNotificationsForUser(userId) {
    return this.notifications.filter(n => n.userId === userId || n.userId === 'ALL');
  },

  // Mark notification as read
  readNotification(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveNotifications();
      this.updateBadge();
    }
  },

  // Approve a beneficiary request
  approveBeneficiary(userId, userName) {
    this.addNotification({
      type: 'approval',
      title: '✅ تمت الموافقة',
      desc: `تم قبول طلبك للحصول على الدم. سيتواصل معك المتبرعون قريباً.`,
      userId
    });
  },

  rejectBeneficiary(userId, reason) {
    this.addNotification({
      type: 'alert',
      title: '❌ تم رفض الطلب',
      desc: `تم رفض طلبك. السبب: ${reason || 'الوثائق غير مكتملة'}`,
      userId
    });
  },

  // Update unread badge
  updateBadge() {
    const user = App.user;
    if (!user) return;

    const unreadMsgs = this.messages.filter(m => m.receiverId === user.id && !m.read).length;
    const unreadNotifs = this.notifications.filter(n => (n.userId === user.id || n.userId === 'ALL') && !n.read).length;
    this.unreadCount = unreadMsgs + unreadNotifs;

    // Update badge in header/sidebar
    document.querySelectorAll('.notif-badge-count').forEach(el => {
      el.textContent = this.unreadCount;
      el.style.display = this.unreadCount > 0 ? '' : 'none';
    });

    document.querySelectorAll('.notif-count[data-type="chat"]').forEach(el => {
      el.textContent = unreadMsgs;
      el.style.display = unreadMsgs > 0 ? '' : 'none';
    });

    document.querySelectorAll('.notif-count[data-type="notif"]').forEach(el => {
      el.textContent = unreadNotifs;
      el.style.display = unreadNotifs > 0 ? '' : 'none';
    });
  },

  // Render chat list in sidebar
  renderChatList() {
    const listEl = document.getElementById('chat-list');
    if (!listEl) return;

    const user = App.user;
    if (!user) return;

    const chats = user.type === 'admin' ? this.getAllChats() : this.getChatsForUser(user.id);

    if (chats.length === 0) {
      listEl.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.85rem;">${App.lang === 'ar' ? 'لا توجد محادثات بعد' : 'No conversations yet'}</div>`;
      return;
    }

    listEl.innerHTML = chats.map(chat => {
      const name = user.type === 'admin' ? `${chat.user1Name} ↔ ${chat.user2Name}` : chat.name;
      const time = chat.time ? new Date(chat.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '';
      return `
        <div class="chat-item ${chat.flagged ? 'chat-flagged' : ''} ${this.currentChat === chat.id ? 'active' : ''}"
             onclick="ChatSystem.openChat('${chat.id}', '${name}')">
          <div class="chat-avatar">${name.charAt(0)}</div>
          <div class="chat-item-info">
            <div class="chat-item-name">${name} ${chat.flagged ? '⚠️' : ''}</div>
            <div class="chat-item-preview">${chat.lastMsg.substring(0, 40)}${chat.lastMsg.length > 40 ? '...' : ''}</div>
          </div>
          <div class="chat-item-time">${time}</div>
        </div>
      `;
    }).join('');
  },

  // Open a specific chat
  openChat(chatId, chatName) {
    this.currentChat = chatId;
    const user = App.user;

    // Update header
    const chatHeaderEl = document.getElementById('chat-header-name');
    if (chatHeaderEl) chatHeaderEl.textContent = chatName;

    // Mark as read
    if (user) this.markRead(chatId, user.id);

    this.renderCurrentChat();
    this.renderChatList();
  },

  // Render current chat messages
  renderCurrentChat() {
    const messagesEl = document.getElementById('chat-messages');
    if (!messagesEl || !this.currentChat) return;

    const user = App.user;
    const chatMsgs = this.messages.filter(m => m.chatId === this.currentChat);

    if (chatMsgs.length === 0) {
      messagesEl.innerHTML = `
        <div style="text-align:center;color:var(--text-muted);font-size:0.9rem;margin:auto;">
          ${App.lang === 'ar' ? 'ابدأ المحادثة' : 'Start the conversation'}
        </div>`;
      return;
    }

    messagesEl.innerHTML = chatMsgs.map(msg => {
      const isMine = user && msg.senderId === user.id;
      const time = new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
      return `
        <div>
          <div class="msg-bubble ${isMine ? 'sent' : 'received'} ${msg.flagged ? 'chat-flagged' : ''}">
            ${msg.flagged ? '<span style="font-size:0.75rem;opacity:0.7;">⚠️ مراقبة الإدارة</span><br>' : ''}
            ${msg.text}
            <div class="msg-time">${time}</div>
          </div>
        </div>
      `;
    }).join('');

    messagesEl.scrollTop = messagesEl.scrollHeight;
  },

  // Send message from input
  handleSend() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim() || !this.currentChat) return;

    const user = App.user;
    if (!user) return;

    // Get receiver from chatId
    const parts = this.currentChat.split('_');
    const receiverId = parts.find(p => p !== user.id) || 'ADMIN001';
    const receiverName = receiverId === 'ADMIN001' ? 'Admin' : 'User';

    this.sendMessage(user.id, user.name || user.fullname || user.hospital_name, receiverId, receiverName, input.value);
    input.value = '';
  },

  // Render notifications
  renderNotifications() {
    const listEl = document.getElementById('notifications-list');
    if (!listEl) return;

    const user = App.user;
    if (!user) return;

    const notifs = this.getNotificationsForUser(user.id).reverse();

    if (notifs.length === 0) {
      listEl.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:40px;">${App.lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</div>`;
      return;
    }

    const icons = { approval: '✅', message: '💬', alert: '⚠️', info: 'ℹ️' };
    const iconClasses = { approval: 'approval', message: 'message', alert: 'alert', info: 'info' };

    listEl.innerHTML = notifs.map(notif => `
      <div class="notif-item ${notif.read ? '' : 'unread'}" onclick="ChatSystem.readNotification('${notif.id}');this.classList.remove('unread')">
        <div class="notif-icon ${iconClasses[notif.type] || 'info'}">${icons[notif.type] || 'ℹ️'}</div>
        <div class="notif-content">
          <div class="notif-title">${notif.title}</div>
          <p class="notif-desc">${notif.desc}</p>
          <div class="notif-time">${new Date(notif.timestamp).toLocaleString('ar-EG')}</div>
        </div>
      </div>
    `).join('');
  },

  // Polling (simulate real-time)
  startPolling() {
    setInterval(() => {
      this.updateBadge();
    }, 5000);
  },

  // Save to localStorage
  saveMessages() {
    localStorage.setItem('qh_messages', JSON.stringify(this.messages));
  },

  saveNotifications() {
    localStorage.setItem('qh_notifications', JSON.stringify(this.notifications));
  }
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (App.user) {
    ChatSystem.init();
  }

  // Chat send button
  document.getElementById('btn-chat-send')?.addEventListener('click', () => {
    ChatSystem.handleSend();
  });

  document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ChatSystem.handleSend();
    }
  });

  // Start chat with admin button
  document.getElementById('btn-contact-admin')?.addEventListener('click', () => {
    const user = App.user;
    if (!user) return;
    ChatSystem.currentChat = ChatSystem.getChatId(user.id, 'ADMIN001');
    ChatSystem.renderCurrentChat();
    window.location.href = 'chat.html';
  });
});

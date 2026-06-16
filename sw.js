// 정원 × 여기갑세 서비스워커
// 역할: 웹푸시 수신 + 알림 클릭 처리. (데이터 캐싱은 하지 않음 — 항상 최신)

const APP_URL = '/';

// 설치되면 바로 활성화
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// 푸시 수신 → 알림 표시
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {
    data = { title: '정원 기도회', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || '🌿 정원 기도회';
  const options = {
    body: data.body || '잠시 후 정원 온라인 기도회가 시작됩니다.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'garden-prayer',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || APP_URL }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// 알림 클릭 → 앱 열기(이미 열려 있으면 포커스)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || APP_URL;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

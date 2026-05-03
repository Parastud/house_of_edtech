import { Colors } from '../theme/colors';
import { Course } from '../types';

export const buildCourseWebViewHTML = (course: Course): string => {
  const safe = (val: string | number) =>
    String(val)
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/<\/script>/gi, '<\\/script>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <title>${safe(course.title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --primary: ${Colors.primary};
      --accent: ${Colors.accent};
      --bg: ${Colors.background};
      --surface: ${Colors.surface};
      --text: ${Colors.textPrimary};
      --text-secondary: ${Colors.textSecondary};
      --border: ${Colors.border};
      --success: ${Colors.success};
      --radius: 12px;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }

    .hero {
      position: relative;
      height: 220px;
      overflow: hidden;
    }

    .hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7));
    }

    .hero-badge {
      position: absolute;
      top: 14px;
      right: 14px;
      background: var(--accent);
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
    }

    .content {
      padding: 20px;
    }

    .category {
      display: inline-block;
      background: rgba(79,70,229,0.1);
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 3px 10px;
      border-radius: 20px;
      margin-bottom: 10px;
    }

    h1 {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 6px;
      color: var(--text);
    }

    .brand {
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }

    .stats-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .stat-icon { font-size: 15px; }

    .rating { color: #F59E0B; font-weight: 700; }

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 8px;
    }

    .description {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: 24px;
    }

    .instructor-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px;
      margin-bottom: 24px;
    }

    .instructor-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .instructor-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
    }

    .instructor-meta {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      margin-bottom: 16px;
    }

    .price-final {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary);
    }

    .price-original {
      font-size: 13px;
      color: var(--text-secondary);
      text-decoration: line-through;
      margin-top: 2px;
    }

    .discount-badge {
      background: rgba(16,185,129,0.12);
      color: var(--success);
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
    }

    .action-btn {
      width: 100%;
      padding: 16px;
      border-radius: var(--radius);
      border: none;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .action-btn:active { opacity: 0.85; }

    .enroll-btn {
      background: var(--primary);
      color: #fff;
    }

    .enrolled-btn {
      background: rgba(16,185,129,0.12);
      color: var(--success);
    }

    /* Bookmark status bar */
    .status-bar {
      display: none;
      align-items: center;
      gap: 8px;
      background: rgba(245,158,11,0.1);
      border: 1px solid rgba(245,158,11,0.3);
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
      font-size: 13px;
      font-weight: 600;
      color: #D97706;
    }
    .status-bar.visible { display: flex; }
  </style>
</head>
<body>
  <div class="hero">
    <img id="heroImg" src="${safe(course.thumbnailUrl)}" alt="${safe(course.title)}" />
    <div class="hero-overlay"></div>
    <div class="hero-badge" id="categoryBadge">${safe(course.category)}</div>
  </div>

  <div class="content">
    <span class="category" id="categoryLabel">${safe(course.category)}</span>
    <h1 id="courseTitle">${safe(course.title)}</h1>
    <p class="brand" id="courseBrand">by ${safe(course.brand)}</p>

    <div class="stats-row">
      <span class="stat">
        <span class="stat-icon">⭐</span>
        <span class="rating" id="courseRating">${safe(course.rating)}</span>
      </span>
      <span class="stat">
        <span class="stat-icon">🏷️</span>
        <span id="coursePrice">${safe(course.price)}</span>
      </span>
    </div>

    <div class="status-bar" id="bookmarkBar">
      🔖 You've bookmarked this course
    </div>

    <p class="section-title">About this course</p>
    <p class="description" id="courseDesc">${safe(course.description)}</p>

    <p class="section-title">Instructor</p>
    <div class="instructor-card">
      <img class="instructor-avatar" id="instructorAvatar"
        src="${safe(course.instructor.avatarUrl)}" alt="${safe(course.instructor.name)}" />
      <div>
        <p class="instructor-name" id="instructorName">${safe(course.instructor.name)}</p>
        <p class="instructor-meta" id="instructorLocation">${safe(course.instructor.location)}</p>
      </div>
    </div>

    <div class="price-row">
      <div>
        <p class="price-final" id="priceFinal">
          $${safe((course.price - (course.price * course.discountPercentage) / 100).toFixed(2))}
        </p>
        <p class="price-original" id="priceOriginal">$${safe(course.price)}</p>
      </div>
      <span class="discount-badge" id="discountBadge">-${safe(Math.round(course.discountPercentage))}%</span>
    </div>

    <button class="action-btn ${course.isEnrolled ? 'enrolled-btn' : 'enroll-btn'}"
      id="enrollBtn"
      onclick="handleEnroll()">
      ${course.isEnrolled ? '✅ Enrolled' : '🚀 Enroll Now'}
    </button>
  </div>

  <script>
    // ── State injected from native ──────────────────────────────────────────
    var state = {
      isBookmarked: ${course.isBookmarked},
      isEnrolled: ${course.isEnrolled},
      courseId: '${safe(course.id)}',
    };

    // ── Reflect initial bookmark state ─────────────────────────────────────
    if (state.isBookmarked) {
      document.getElementById('bookmarkBar').classList.add('visible');
    }

    // ── Enroll button handler — posts event back to native ─────────────────
    function handleEnroll() {
      if (state.isEnrolled) return;
      state.isEnrolled = true;

      var btn = document.getElementById('enrollBtn');
      btn.textContent = '✅ Enrolled';
      btn.className = 'action-btn enrolled-btn';

      postToNative({ type: 'ENROLL', courseId: state.courseId });
    }

    // ── Listen for messages from native app ────────────────────────────────
    // Native can send: { type: 'BOOKMARK_UPDATE', isBookmarked: bool }
    document.addEventListener('message', handleNativeMessage);
    window.addEventListener('message', handleNativeMessage);

    function handleNativeMessage(event) {
      try {
        var msg = JSON.parse(event.data);
        if (msg.type === 'BOOKMARK_UPDATE') {
          state.isBookmarked = msg.isBookmarked;
          var bar = document.getElementById('bookmarkBar');
          if (state.isBookmarked) {
            bar.classList.add('visible');
          } else {
            bar.classList.remove('visible');
          }
        }
      } catch (e) {}
    }

    // ── Post message back to native ────────────────────────────────────────
    function postToNative(payload) {
      try {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      } catch (e) {}
    }

    // Signal to native that WebView is ready
    postToNative({ type: 'WEBVIEW_READY', courseId: state.courseId });
  </script>
</body>
</html>
  `.trim();
};
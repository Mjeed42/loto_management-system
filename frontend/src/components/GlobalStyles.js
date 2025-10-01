import React from "react";
const GlobalStyles = () => (
  <style jsx global>{`
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    :root {
      /* Modern Color Palette - Inspired by contemporary design systems */
      --primary: #6366f1;
      --primary-50: #eef2ff;
      --primary-100: #e0e7ff;
      --primary-200: #c7d2fe;
      --primary-300: #a5b4fc;
      --primary-400: #818cf8;
      --primary-500: #6366f1;
      --primary-600: #4f46e5;
      --primary-700: #4338ca;
      --primary-800: #3730a3;
      --primary-900: #312e81;
      --secondary: #64748b;
      --secondary-50: #f8fafc;
      --secondary-100: #f1f5f9;
      --secondary-200: #e2e8f0;
      --secondary-300: #cbd5e1;
      --secondary-400: #94a3b8;
      --secondary-500: #64748b;
      --secondary-600: #475569;
      --secondary-700: #334155;
      --secondary-800: #1e293b;
      --secondary-900: #0f172a;
      --success: #10b981;
      --success-50: #ecfdf5;
      --success-100: #d1fae5;
      --success-500: #10b981;
      --success-600: #059669;
      --warning: #f59e0b;
      --warning-50: #fffbeb;
      --warning-100: #fef3c7;
      --warning-500: #f59e0b;
      --warning-600: #d97706;
      --danger: #ef4444;
      --danger-50: #fef2f2;
      --danger-100: #fee2e2;
      --danger-500: #ef4444;
      --danger-600: #dc2626;
      --info: #06b6d4;
      --info-50: #ecfeff;
      --info-100: #cffafe;
      --info-500: #06b6d4;
      --info-600: #0891b2;
      /* Neutral Colors */
      --white: #ffffff;
      --black: #000000;
      --gray-50: #f8fafc;
      --gray-100: #f1f5f9;
      --gray-200: #e2e8f0;
      --gray-300: #cbd5e1;
      --gray-400: #94a3b8;
      --gray-500: #64748b;
      --gray-600: #475569;
      --gray-700: #334155;
      --gray-800: #1e293b;
      --gray-900: #0f172a;
      /* Background Gradients */
      --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      --gradient-warm: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      --gradient-cool: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      --gradient-dark: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      /* Spacing System */
      --space-1: 0.25rem;
      --space-2: 0.5rem;
      --space-3: 0.75rem;
      --space-4: 1rem;
      --space-5: 1.25rem;
      --space-6: 1.5rem;
      --space-8: 2rem;
      --space-10: 2.5rem;
      --space-12: 3rem;
      --space-16: 4rem;
      --space-20: 5rem;
      /* Border Radius */
      --radius-sm: 0.25rem;
      --radius: 0.5rem;
      --radius-md: 0.75rem;
      --radius-lg: 1rem;
      --radius-xl: 1.5rem;
      --radius-2xl: 2rem;
      --radius-full: 9999px;
      /* Shadows - Enhanced for depth */
      --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      --shadow-2xl: 0 50px 100px -20px rgba(0, 0, 0, 0.25);
      --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
      --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.4);
      --shadow-colored: 0 10px 25px -5px rgba(99, 102, 241, 0.2);
      /* Transitions */
      --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      --transition-slow: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --transition-bounce: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      /* Typography */
      --font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, sans-serif;
      --font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
        monospace;
      /* Focus styles */
      --focus-ring: 0 0 0 3px rgba(99, 102, 241, 0.1);
      --focus-ring-offset: 2px;
    }
    /* Reset and base styles */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    body {
      font-family: var(--font-family);
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.6;
      color: #000;
      background: linear-gradient(
        135deg,
        var(--gray-50) 0%,
        var(--gray-100) 100%
      );
      min-height: 100vh;
      overflow-x: hidden;
    }
    /* Enhanced container */

    /* Modern button system */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: var(--space-3) var(--space-6);
      font-size: 0.875rem;
      line-height: 1.25;
      border-radius: var(--radius);
      transition: var(--transition);
      cursor: pointer;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      font-family: inherit;
    }
    .btn::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.6s ease;
    }
    .btn:hover::before {
      left: 100%;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    .btn:active {
      transform: translateY(0);
      transition: var(--transition-fast);
    }
    .btn:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
      pointer-events: none;
    }
    .btn:disabled::before {
      display: none;
    }
    /* Button variants */
    .btn-primary {
      color: var(--white);
      background: var(--gradient-primary);
      border: none;
      box-shadow: var(--shadow-sm);
    }
    .btn-primary:hover {
      box-shadow: var(--shadow-glow), var(--shadow-lg);
      transform: translateY(-2px) scale(1.02);
    }
    .btn-secondary {
      color: #f00;
      background: var(--white);
      border: 1px solid var(--gray-300);
      box-shadow: var(--shadow-xs);
    }
    .btn-secondary:hover {
      background: var(--gray-50);
      border-color: var(--gray-400);
    }
    .btn-success {
      color: var(--white);
      background: linear-gradient(
        135deg,
        var(--success-500) 0%,
        var(--success-600) 100%
      );
      border: none;
    }
    .btn-warning {
      color: var(--white);
      background: linear-gradient(
        135deg,
        var(--warning-500) 0%,
        var(--warning-600) 100%
      );
      border: none;
    }
    .btn-danger {
      color: var(--white);
      background: linear-gradient(
        135deg,
        var(--danger-500) 0%,
        var(--danger-600) 100%
      );
      border: none;
    }
    .btn-outline-primary {
      color: var(--primary-600);
      background: transparent;
      border: 2px solid var(--primary-500);
    }
    .btn-outline-primary:hover {
      color: var(--white);
      background: var(--primary-500);
      box-shadow: var(--shadow-glow);
    }
      .me-3 {
      margin-right: 1rem;



    }

    .btn-ghost {
      color: var(--gray-600);
      background: transparent;
      border: none;
    }
    .btn-ghost:hover {
      color: var(--primary-600);
      background: var(--primary-50);
    }
    /* Button sizes */
    .btn-sm {

      font-size: 0.75rem;
    }
    .btn-lg {
      padding: var(--space-4) var(--space-8);
      font-size: 1rem;
    }
    /* Enhanced card system */
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      transition: var(--transition);
      overflow: hidden;
    }
    .card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.8),
        transparent
      );
    }
    .card:hover {
      box-shadow: var(--shadow-xl);
      border-color: rgba(99, 102, 241, 0.2);
    }
    .card-header {
      padding: var(--space-6);
      margin-bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.05) 0%,
        rgba(139, 92, 246, 0.05) 100%
      );
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      border-top-left-radius: calc(var(--radius-lg) - 1px);
      border-top-right-radius: calc(var(--radius-lg) - 1px);
      font-weight: 600;
      color: #000;
    }
    .card-body {
      flex: 1 1 auto;
      padding: var(--space-6);
    }
    .card-footer {
      padding: var(--space-6);
      background: var(--gray-50);
      border-top: 1px solid var(--gray-200);
      border-bottom-left-radius: calc(var(--radius-lg) - 1px);
      border-bottom-right-radius: calc(var(--radius-lg) - 1px);
    }
    /* Enhanced form system */
    .form-group {
      margin-bottom: var(--space-6);
      position: relative;
    }

    .form-control {
      display: block;
      width: 100%;
      padding: var(--space-3) var(--space-4);
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #000;
      background: var(--white);
      border: 2px solid var(--gray-200);
      border-radius: var(--radius);
      transition: var(--transition);
      font-family: inherit;
    }
    .form-control:focus {
      color: #000;
      background: var(--white);
      border-color: var(--primary-500);
      outline: none;
      box-shadow: var(--focus-ring);
      transform: translateY(-1px);
    }
    .form-control::placeholder {
      color: var(--gray-400);
      opacity: 1;
    }
    .form-control.error {
      border-color: var(--danger-500);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    /* Enhanced alert system */
    .alert {
      position: relative;
      padding: var(--space-4) var(--space-6);
      margin-bottom: var(--space-6);
      border: none;
      border-radius: var(--radius-lg);
      backdrop-filter: blur(10px);
      border-left: 4px solid;
      font-weight: 500;
    }
    .alert-success {
      color: var(--success-600);
      background: linear-gradient(
        135deg,
        var(--success-50) 0%,
        rgba(16, 185, 129, 0.05) 100%
      );
      border-left-color: var(--success-500);
    }
    .alert-danger {
      color: var(--danger-600);
      background: linear-gradient(
        135deg,
        var(--danger-50) 0%,
        rgba(239, 68, 68, 0.05) 100%
      );
      border-left-color: var(--danger-500);
    }
    .alert-warning {
      color: var(--warning-600);
      background: linear-gradient(
        135deg,
        var(--warning-50) 0%,
        rgba(245, 158, 11, 0.05) 100%
      );
      border-left-color: var(--warning-500);
    }
    .alert-info {
      color: var(--info-600);
      background: linear-gradient(
        135deg,
        var(--info-50) 0%,
        rgba(6, 182, 212, 0.05) 100%
      );
      border-left-color: var(--info-500);
    }
    /* Enhanced badge system */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-1) var(--space-3);
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: var(--radius-full);
      transition: var(--transition);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-primary {
      color: var(--white);
      background: var(--gradient-primary);
      box-shadow: var(--shadow-xs);
    }
    .badge-secondary {
      color: var(--gray-600);
      background: var(--gray-100);
    }
    .badge-success {
      color: var(--white);
      background: linear-gradient(
        135deg,
        var(--success-500) 0%,
        var(--success-600) 100%
      );
    }
    .badge-warning {
      color: var(--white);
      background: linear-gradient(
        135deg,
        var(--warning-500) 0%,
        var(--warning-600) 100%
      );
    }
    .badge-danger {
      color: var(--white);
      background: linear-gradient(
        135deg,
        var(--danger-500) 0%,
        var(--danger-600) 100%
      );
    }
    .badge-info {
      color: var(--white);
      background: linear-gradient(
        135deg,
        var(--info-500) 0%,
        var(--info-600) 100%
      );
    }
    /* Enhanced table system */
    .table-wrapper {
      width: 100%;
      overflow-x: auto;
      margin-bottom: var(--space-6);
      -webkit-overflow-scrolling: touch;
    }
    .table-light {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: var(--shadow);
      border-radius: var(--radius-lg);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      overflow: hidden;

    }
    .table {
      width: 100%;
      min-width: 600px; /* Ensures readability on mobile */
      color: #000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-collapse: separate;
      border-spacing: 0;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    .table th,
    .table td {
      padding: var(--space-4) var(--space-6);
      vertical-align: middle;
      border-bottom: 1px solid var(--gray-200);
      white-space: nowrap;
    }
    .table thead th {
      vertical-align: bottom;
      border-bottom: 2px solid #0069ff;
      background: linear-gradient(#004cff 0%, #0061ff 100%);
      font-weight: 600;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.875rem;
      text-align: left;

      top: 0;
      z-index: 1;
      box-shadow: var(--shadow-sm);
      /* For better visibility on scroll */
      backdrop-filter: blur(10px);
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    }
    .table thead th:last-child {
      border-right: none;

    }
    .table tbody tr:nth-of-type(even) {
      background: var(--gray-50);
      border-left: 4px solid var(--primary-500);
      transition: var(--transition);
      &:hover {
        background: var(--gray-100);
      }

    }
    .table tbody tr {
      transition: var(--transition);
    }
    .table tbody tr:hover {
      background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.02) 0%,
        rgba(139, 92, 246, 0.02) 100%
      );
    }
    /* Enhanced navigation */
    .navbar {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-8);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: var(--shadow-sm);
    }
    .navbar-brand {
      display: inline-flex;
      align-items: center;
      padding-top: 0.3125rem;
      padding-bottom: 0.3125rem;
      margin-right: var(--space-4);
      font-size: 1.5rem;
      line-height: inherit;
      white-space: nowrap;
      font-weight: 800;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .nav {
      display: flex;
      flex-wrap: wrap;
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;
      gap: var(--space-2);
    }
    .nav-link {
      display: flex;
      align-items: center;
      padding: var(--space-3) var(--space-5);
      text-decoration: none;
      color: var(--gray-600);
      transition: var(--transition);
      border-radius: var(--radius);
      font-weight: 500;
      position: relative;
      overflow: hidden;
    }
    .nav-link::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: var(--gradient-primary);
      transition: var(--transition);
      transform: translateX(-50%);
    }
    .nav-link:hover {
      color: var(--primary-600);
      background: rgba(99, 102, 241, 0.05);
    }
    .nav-link:hover::before {
      width: 80%;
    }
    .nav-link.active {
      color: var(--primary-600);
      font-weight: 600;
      background: rgba(99, 102, 241, 0.1);
    }
    .nav-link.active::before {
      width: 80%;
    }
    /* Enhanced dropdown */
    .dropdown {
      position: relative;
    }
  .dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #000;
  text-align: left;
  list-style: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}
    .dropdown-menu.show {
      display: block;
      animation: dropdownFadeIn 0.2s ease-out;
      z-index: 2000;
    }
    header,
    .navbar,
    .dropdown,
    .dropdown-menu {
      position: relative;
      z-index: 2000;
    }
    @keyframes dropdownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Enhanced spinner */
    .spinner-border {
      display: inline-flex;
      width: 2rem;
      height: 2rem;
      vertical-align: text-bottom;
      border: 0.25em solid;
      border-color: var(--primary-500) transparent var(--primary-500)
        transparent;
      border-radius: 50%;
      animation: spinner-pulse 1.5s ease-in-out infinite;
    }
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
      border-width: 0.2em;
    }
    @keyframes spinner-pulse {
      0% {
        transform: rotate(0deg) scale(1);
        border-color: var(--primary-500) transparent var(--primary-500)
          transparent;
      }
      50% {
        transform: rotate(180deg) scale(1.1);
        border-color: var(--warning-500) transparent var(--warning-500)
          transparent;
      }
      100% {
        transform: rotate(360deg) scale(1);
        border-color: var(--primary-500) transparent var(--primary-500)
          transparent;
      }
    }
    /* Utility Classes */
    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .text-left {
      text-align: left;
    }
    .text-muted {
      color: #000;
    }
    .text-white {
      color: var(--white);
    }
    .text-primary {
      color: var(--primary-600);
    }
    .text-secondary {
      color: var(--secondary-600);
    }
    .text-success {
      color: var(--success-600);
    }
    .text-danger {
      color: var(--danger-600);
    }
    .text-warning {
      color: var(--warning-600);
    }
    .text-info {
      color: var(--info-600);
    }
    .bg-white {
      background-color: var(--white);
    }
    .bg-primary {
      background: var(--gradient-primary);
    }
    .bg-secondary {
      background: var(--secondary-100);
    }
    .bg-glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .fw-semibold {
      font-weight: 600;
    }
    .fw-medium {
      font-weight: 500;
    }
    .fw-normal {
      font-weight: 400;
    }
    .fw-light {
      font-weight: 300;
    }
    .fs-1 {
      font-size: 2.5rem;
      line-height: 1.2;
    }
    .fs-2 {
      font-size: 2rem;
      line-height: 1.25;
    }
    .fs-3 {
      font-size: 1.75rem;
      line-height: 1.3;
    }
    .fs-4 {
      font-size: 1.5rem;
      line-height: 1.35;
    }
    .fs-5 {
      font-size: 1.25rem;
      line-height: 1.4;
    }
    .fs-6 {
      font-size: 1rem;
      line-height: 1.5;
    }
    /* Spacing utilities */
    .m-0 {
      margin: 0;
    }
    .m-1 {
      margin: var(--space-1);
    }
    .m-2 {
      margin: var(--space-2);
    }
    .m-3 {
      margin: var(--space-3);
    }
    .m-4 {
      margin: var(--space-4);
    }
    .m-5 {
      margin: var(--space-5);
    }
    .m-6 {
      margin: var(--space-6);
    }
    .m-8 {
      margin: var(--space-8);
    }
    .mb-0 {
      margin-bottom: 0;
    }
    .mb-1 {
      margin-bottom: var(--space-1);
    }
    .mb-2 {
      margin-bottom: var(--space-2);
    }
    .mb-3 {
      margin-bottom: var(--space-3);
    }
    .mb-4 {
      margin-bottom: var(--space-4);
    }
    .mb-5 {
      margin-bottom: var(--space-5);
    }
    .mb-6 {
      margin-bottom: var(--space-6);
    }
    .mb-8 {
      margin-bottom: var(--space-8);
    }
    .mt-0 {
      margin-top: 0;
    }
    .mt-1 {
      margin-top: var(--space-1);
    }
    .mt-2 {
      margin-top: var(--space-2);
    }
    .mt-3 {
      margin-top: var(--space-3);
    }
    .mt-4 {
      margin-top: var(--space-4);
    }
    .mt-5 {
      margin-top: var(--space-5);
    }
    .mt-6 {
      margin-top: var(--space-6);
    }
    .mt-8 {
      margin-top: var(--space-8);
    }
    .p-0 {
      padding: 0;
    }
    .p-1 {
      padding: var(--space-1);
    }
    .p-2 {
      padding: var(--space-2);
    }
    .p-3 {
      padding: var(--space-3);
    }
    .p-4 {
      padding: var(--space-4);
    }
    .p-5 {
      padding: var(--space-5);
    }
    .p-6 {
      padding: var(--space-6);
    }
    .p-8 {
      padding: var(--space-8);
    }
    .py-1 {
      padding-top: var(--space-1);
      padding-bottom: var(--space-1);
    }
    .py-2 {
      padding-top: var(--space-2);
      padding-bottom: var(--space-2);
    }
    .py-3 {
      padding-top: var(--space-3);
      padding-bottom: var(--space-3);
    }
    .py-4 {
      padding-top: var(--space-4);
      padding-bottom: var(--space-4);
    }
    .py-5 {
      padding-top: var(--space-5);
      padding-bottom: var(--space-5);
    }
    .py-6 {
      padding-top: var(--space-6);
      padding-bottom: var(--space-6);
    }
    .py-8 {
      padding-top: var(--space-8);
      padding-bottom: var(--space-8);
    }
    .px-1 {
      padding-left: var(--space-1);
      padding-right: var(--space-1);
    }
    .px-2 {
      padding-left: var(--space-2);
      padding-right: var(--space-2);
    }
    .px-3 {
      padding-left: var(--space-3);
      padding-right: var(--space-3);
    }
    .px-4 {
      padding-left: var(--space-4);
      padding-right: var(--space-4);
    }
    .px-5 {
      padding-left: var(--space-5);
      padding-right: var(--space-5);
    }
    .px-6 {
      padding-left: var(--space-6);
      padding-right: var(--space-6);
    }
    .px-8 {
      padding-left: var(--space-8);
      padding-right: var(--space-8);
    }
    /* Flexbox utilities */
    .d-flex {
      display: flex;
    }
    .d-inline-flex {
      display: inline-flex;
    }
    .d-grid {
      display: grid;
    }
    .d-block {
      display: block;
    }
    .d-none {
      display: none;
    }
    .justify-content-start {
      justify-content: flex-start;
    }
    .justify-content-end {
      justify-content: flex-end;
    }
    .justify-content-center {
      justify-content: center;
    }
    .justify-content-between {
      justify-content: space-between;
    }
    .justify-content-around {
      justify-content: space-around;
    }
    .justify-content-evenly {
      justify-content: space-evenly;
    }
    .align-items-start {
      align-items: flex-start;
    }
    .align-items-end {
      align-items: flex-end;
    }
    .align-items-center {
      align-items: center;
    }
    .align-items-baseline {
      align-items: baseline;
    }
    .align-items-stretch {
      align-items: stretch;
    }
    .flex-row {
      flex-direction: row;
    }
    .flex-column {
      flex-direction: column;
    }
    .flex-wrap {
      flex-wrap: wrap;
    }
    .flex-nowrap {
      flex-wrap: nowrap;
    }
    /* Size utilities */
    .w-100 {
      width: 100%;
    }
    .w-75 {
      width: 75%;
    }
    .w-50 {
      width: 50%;
    }
    .w-25 {
      width: 25%;
    }
    .h-100 {
      height: 100%;
    }
    .h-75 {
      height: 75%;
    }
    .h-50 {
      height: 50%;
    }
    .h-25 {
      height: 25%;
    }
    /* Shadow utilities */
    .shadow-none {
      box-shadow: none;
    }
    .shadow-xs {
      box-shadow: var(--shadow-xs);
    }
    .shadow-sm {
      box-shadow: var(--shadow-sm);
    }
    .shadow {
      box-shadow: var(--shadow);
    }
    .shadow-md {
      box-shadow: var(--shadow-md);
    }
    .shadow-lg {
      box-shadow: var(--shadow-lg);
    }
    .shadow-xl {
      box-shadow: var(--shadow-xl);
    }
    .shadow-2xl {
      box-shadow: var(--shadow-2xl);
    }
    .shadow-inner {
      box-shadow: var(--shadow-inner);
    }
    .shadow-glow {
      box-shadow: var(--shadow-glow);
    }
    /* Border radius utilities */
    .rounded-none {
      border-radius: 0;
    }
    .rounded-sm {
      border-radius: var(--radius-sm);
    }
    .rounded {
      border-radius: var(--radius);
    }
    .rounded-md {
      border-radius: var(--radius-md);
    }
    .rounded-lg {
      border-radius: var(--radius-lg);
    }
    .rounded-xl {
      border-radius: var(--radius-xl);
    }
    .rounded-2xl {
      border-radius: var(--radius-2xl);
    }
    .rounded-full {
      border-radius: var(--radius-full);
    }
    /* Interactive utilities */
    .cursor-pointer {
      cursor: pointer;
    }
    .cursor-not-allowed {
      cursor: not-allowed;
    }
    .cursor-default {
      cursor: default;
    }
    /* Gap utilities */
    .gap-1 {
      gap: var(--space-1);
    }
    .gap-2 {
      gap: var(--space-2);
    }
    .gap-3 {
      gap: var(--space-3);
    }
    .gap-4 {
      gap: var(--space-4);
    }
    .gap-5 {
      gap: var(--space-5);
    }
    .gap-6 {
      gap: var(--space-6);
    }
    .gap-8 {
      gap: var(--space-8);
    }
    /* Position utilities */
    .position-relative {
      position: relative;
    }
    .position-absolute {
      position: absolute;
    }
    .position-fixed {
      position: fixed;
    }
    .position-sticky {
      position: sticky;
    }
    /* Overflow utilities */
    .overflow-hidden {
      overflow: hidden;
    }
    .overflow-auto {
      overflow: auto;
    }
    .overflow-scroll {
      overflow: scroll;
    }
    /* Accessibility */
    .visually-hidden {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
    /* ============ RESPONSIVE DESIGN SYSTEM ============ */
    
    /* Mobile First Approach - Base styles for mobile devices */
    @media (max-width: 575.98px) {
      /* Extra small devices (phones, less than 576px) */
      .container {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      }
      
      /* Typography adjustments */
      .fs-1 { font-size: 1.75rem; }
      .fs-2 { font-size: 1.5rem; }
      .fs-3 { font-size: 1.25rem; }
      .fs-4 { font-size: 1.125rem; }
      .fs-5 { font-size: 1rem; }
      
      /* Button adjustments */
      .btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        min-height: 44px; /* Touch-friendly minimum */
      }
      .btn-sm {
        padding: 0.375rem 0.5rem;
        font-size: 0.75rem;
        min-height: 36px;
      }
      .btn-lg {
        padding: 0.75rem 1rem;
        font-size: 1rem;
        min-height: 48px;
      }
      
      /* Card adjustments */
      .card {
        margin-bottom: 1rem;
        border-radius: 0.5rem;
      }
      .card-header {
        padding: 1rem;
        font-size: 0.875rem;
      }
      .card-body {
        padding: 1rem;
      }
      
      /* Form adjustments */
      .form-control {
        padding: 0.75rem;
        font-size: 1rem; /* Prevents zoom on iOS */
        min-height: 44px;
      }
      .form-label {
        font-size: 0.875rem;
        margin-bottom: 0.375rem;
      }
      
      /* Table adjustments */
      .table-wrapper {
        border-radius: 0.5rem;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .table {
        min-width: 600px;
        font-size: 0.875rem;
      }
      .table th,
      .table td {
        padding: 0.5rem 0.375rem;
        white-space: nowrap;
      }
      .table thead th {
        font-size: 0.75rem;
        padding: 0.5rem 0.375rem;
      }
      
      /* Navigation adjustments */
      .navbar {
        padding: 0.5rem 0.75rem;
        flex-wrap: wrap;
      }
      .navbar-brand {
        font-size: 1.25rem;
      }
      .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      }
      
      /* Badge adjustments */
      .badge {
        font-size: 0.625rem;
        padding: 0.25rem 0.5rem;
      }
      
      /* Spacing adjustments */
      .mb-4 { margin-bottom: 1rem !important; }
      .mb-5 { margin-bottom: 1.25rem !important; }
      .mb-6 { margin-bottom: 1.5rem !important; }
      .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
      .py-5 { padding-top: 1.25rem !important; padding-bottom: 1.25rem !important; }
      
      /* Grid adjustments */
      .row {
        margin-left: -0.375rem;
        margin-right: -0.375rem;
      }
      .row > * {
        padding-left: 0.375rem;
        padding-right: 0.375rem;
      }
      
      /* Flex adjustments */
      .d-flex.flex-wrap {
        gap: 0.5rem;
      }
      
      /* Home page specific */
      .Home-header {
        padding: 1rem;
        margin-bottom: 1.5rem;
      }
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }
      .header-logo {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
      .logo-text h1 {
        font-size: 1.5rem;
      }
      .current-time {
        font-size: 1rem;
      }
      .Home-cards {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .Home-card {
        padding: 1rem;
      }
      .card-icon {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
      }
      
      /* Admin page specific */
      .stats-card {
        padding: 1rem;
      }
      .stats-icon-wrapper {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }
      .stats-number {
        font-size: 1.25rem;
      }
      .empty-state {
        padding: 2rem 1rem;
      }
      .empty-state-icon {
        font-size: 2rem;
      }
      .empty-state-title {
        font-size: 1.125rem;
      }
      
      /* Hide non-essential columns on mobile */
      .d-none.d-sm-table-cell {
        display: none !important;
      }
      
      /* Action buttons stack vertically on mobile */
      .d-flex.gap-1 {
        flex-direction: column;
        gap: 0.25rem !important;
      }
      .d-flex.gap-1 .btn {
        width: 100%;
        justify-content: center;
      }
    }
    
    /* Small devices (landscape phones, 576px and up) */
    @media (min-width: 576px) and (max-width: 767.98px) {
      .container {
        max-width: 540px;
      }
      
      .table th,
      .table td {
        padding: 0.5rem 0.75rem;
      }
      
      .Home-cards {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.25rem;
      }
      
      .d-flex.gap-1 {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }
    
    /* Medium devices (tablets, 768px and up) */
    @media (min-width: 768px) and (max-width: 991.98px) {
      .container {
        max-width: 720px;
      }
      
      .table th,
      .table td {
        padding: 0.75rem 1rem;
      }
      
      .Home-cards {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      
      .Home-card {
        padding: 1.5rem;
      }
      
      .card-icon {
        width: 60px;
        height: 60px;
        font-size: 1.75rem;
      }
      
      .stats-card {
        padding: 1.25rem;
      }
      
      .stats-icon-wrapper {
        width: 50px;
        height: 50px;
        font-size: 1.25rem;
      }
      
      /* Show some hidden columns on tablets */
      .d-none.d-md-table-cell {
        display: table-cell !important;
      }
    }
    
    /* Large devices (desktops, 992px and up) */
    @media (min-width: 992px) and (max-width: 1199.98px) {
      .container {
        max-width: 100%;
        padding-left: 2rem;
        padding-right: 2rem;
      }
      
      .table th,
      .table td {
        padding: 1rem 1.25rem;
      }
      
      .Home-cards {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
      }
      
      .Home-card {
        padding: 2rem;
      }
      
      .card-icon {
        width: 70px;
        height: 70px;
        font-size: 2rem;
      }
      
      .stats-card {
        padding: 1.5rem;
      }
      
      .stats-icon-wrapper {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }
      
      /* Show more columns on large screens */
      .d-none.d-lg-table-cell {
        display: table-cell !important;
      }
    }
    
    /* Extra large devices (large desktops, 1200px and up) */
    @media (min-width: 1200px) {
      .container {
        max-width: 100%;
        padding-left: 3rem;
        padding-right: 3rem;
      }
      
      .table th,
      .table td {
        padding: 1rem 1.5rem;
      }
      
      .Home-cards {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2.5rem;
      }
      
      .Home-card {
        padding: 2.5rem;
      }
      
      .card-icon {
        width: 80px;
        height: 80px;
        font-size: 2.25rem;
      }
      
      .stats-card {
        padding: 2rem;
      }
      
      .stats-icon-wrapper {
        width: 70px;
        height: 70px;
        font-size: 1.75rem;
      }
    }
    
    /* Extra extra large devices (1400px and up) */
    @media (min-width: 1400px) {
      .container {
        max-width: 100%;
        padding-left: 4rem;
        padding-right: 4rem;
      }
      
      .Home-cards {
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
        gap: 3rem;
      }
    }
    
    /* Ultra-wide displays (1600px and up) */
    @media (min-width: 1600px) {
      .container {
        max-width: 100%;
        padding-left: 5rem;
        padding-right: 5rem;
      }
      
      .Home-cards {
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 3.5rem;
      }
      
      .Home-card {
        padding: 3rem;
      }
      
      .card-icon {
        width: 90px;
        height: 90px;
        font-size: 2.5rem;
      }
      
      .stats-card {
        padding: 2.5rem;
      }
      
      .stats-icon-wrapper {
        width: 80px;
        height: 80px;
        font-size: 2rem;
      }
    }
    
    /* Landscape orientation adjustments */
    @media (orientation: landscape) and (max-height: 500px) {
      .Home-header {
        padding: 1rem;
        margin-bottom: 1rem;
      }
      
      .card-header {
        padding: 0.75rem 1rem;
      }
      
      .card-body {
        padding: 0.75rem 1rem;
      }
      
      .py-4 {
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
      }
    }
    
    /* High DPI displays */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      .btn,
      .form-control,
      .nav-link {
        border-width: 0.5px;
      }
    }
    
    /* Print styles */
    @media print {
      .btn,
      .navbar,
      .dropdown-menu {
        display: none !important;
      }
      
      .card {
        border: 1px solid #000 !important;
        box-shadow: none !important;
        break-inside: avoid;
      }
      
      .table {
        font-size: 12px;
      }
      
      .table th,
      .table td {
        padding: 0.25rem;
        border: 1px solid #000 !important;
      }
    }
    
    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      :root {
        /* Dark mode color palette */
        --white: #0f0f0f;
        --black: #ffffff;
        --gray-50: #1a1a1a;
        --gray-100: #262626;
        --gray-200: #333333;
        --gray-300: #404040;
        --gray-400: #4d4d4d;
        --gray-500: #595959;
        --gray-600: #666666;
        --gray-700: #737373;
        --gray-800: #808080;
        --gray-900: #8c8c8c;
        
        /* Dark mode primary colors */
        --primary: #818cf8;
        --primary-50: #1e1b4b;
        --primary-100: #312e81;
        --primary-200: #4338ca;
        --primary-300: #4f46e5;
        --primary-400: #6366f1;
        --primary-500: #818cf8;
        --primary-600: #a5b4fc;
        --primary-700: #c7d2fe;
        --primary-800: #e0e7ff;
        --primary-900: #eef2ff;
        
        /* Dark mode secondary colors */
        --secondary: #94a3b8;
        --secondary-50: #1e293b;
        --secondary-100: #334155;
        --secondary-200: #475569;
        --secondary-300: #64748b;
        --secondary-400: #94a3b8;
        --secondary-500: #cbd5e1;
        --secondary-600: #e2e8f0;
        --secondary-700: #f1f5f9;
        --secondary-800: #f8fafc;
        --secondary-900: #ffffff;
        
        /* Dark mode status colors */
        --success: #34d399;
        --success-50: #064e3b;
        --success-100: #065f46;
        --success-500: #10b981;
        --success-600: #34d399;
        
        --warning: #fbbf24;
        --warning-50: #78350f;
        --warning-100: #92400e;
        --warning-500: #f59e0b;
        --warning-600: #fbbf24;
        
        --danger: #f87171;
        --danger-50: #7f1d1d;
        --danger-100: #991b1b;
        --danger-500: #ef4444;
        --danger-600: #f87171;
        
        --info: #22d3ee;
        --info-50: #164e63;
        --info-100: #155e75;
        --info-500: #06b6d4;
        --info-600: #22d3ee;
      }
      
      body {
        background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
        color: var(--black);
      }
      
      /* Card styling */
      .card {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
        color: var(--black);
      }
      
      .card-header {
        background: linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
        border-bottom-color: rgba(255, 255, 255, 0.1);
        color: var(--black);
      }
      
      .card-footer {
        background: var(--gray-100);
        border-top-color: rgba(255, 255, 255, 0.1);
      }
      
      /* Table styling */
      .table {
        background: rgba(26, 26, 26, 0.95);
        color: var(--black);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .table th {
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .table td {
        border-color: rgba(255, 255, 255, 0.1);
        color: var(--black);
      }
      
      .table tbody tr:nth-of-type(even) {
        background: rgba(51, 51, 51, 0.3);
        border-left-color: var(--primary-500);
      }
      
      .table tbody tr:hover {
        background: rgba(129, 140, 248, 0.1);
      }
      
      /* Form styling */
      .form-control {
        background: rgba(26, 26, 26, 0.9);
        border-color: var(--gray-300);
        color: var(--black);
      }
      
      .form-control:focus {
        border-color: var(--primary-500);
        background: rgba(26, 26, 26, 0.95);
        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
      }
      
      .form-control::placeholder {
        color: var(--gray-600);
      }
      
      .form-label {
        color: var(--black);
      }
      
      /* Button styling */
      .btn-primary {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        color: #000000;
        border-color: var(--primary-500);
      }
      
      .btn-primary:hover {
        background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
        color: #000000;
      }
      
      .btn-secondary {
        background: var(--gray-200);
        color: var(--black);
        border-color: var(--gray-300);
      }
      
      .btn-secondary:hover {
        background: var(--gray-300);
        color: var(--black);
      }
      
      .btn-outline-primary {
        color: var(--primary-500);
        border-color: var(--primary-500);
        background: transparent;
      }
      
      .btn-outline-primary:hover {
        background: var(--primary-500);
        color: #000000;
      }
      
      /* Navigation styling */
      .navbar {
        background: rgba(26, 26, 26, 0.95);
        border-bottom-color: rgba(255, 255, 255, 0.1);
      }
      
      .navbar-brand {
        color: var(--black);
      }
      
      .nav-link {
        color: var(--gray-600);
      }
      
      .nav-link:hover {
        color: var(--primary-500);
        background: rgba(129, 140, 248, 0.1);
      }
      
      .nav-link.active {
        color: var(--primary-500);
        background: rgba(129, 140, 248, 0.15);
      }
      
      /* Dropdown styling */
      .dropdown-menu {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }
      
      .dropdown-item {
        color: var(--black);
      }
      
      .dropdown-item:hover {
        background: rgba(129, 140, 248, 0.1);
        color: var(--primary-500);
      }
      
      /* Alert styling */
      .alert-success {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%);
        color: var(--success-600);
        border-left-color: var(--success-500);
      }
      
      .alert-danger {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.05) 100%);
        color: var(--danger-600);
        border-left-color: var(--danger-500);
      }
      
      .alert-warning {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%);
        color: var(--warning-600);
        border-left-color: var(--warning-500);
      }
      
      .alert-info {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(34, 211, 238, 0.05) 100%);
        color: var(--info-600);
        border-left-color: var(--info-500);
      }
      
      /* Badge styling */
      .badge-primary {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        color: #000000;
      }
      
      .badge-secondary {
        background: var(--gray-200);
        color: var(--black);
      }
      
      .badge-success {
        background: linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%);
        color: #000000;
      }
      
      .badge-warning {
        background: linear-gradient(135deg, var(--warning-500) 0%, var(--warning-600) 100%);
        color: #000000;
      }
      
      .badge-danger {
        background: linear-gradient(135deg, var(--danger-500) 0%, var(--danger-600) 100%);
        color: #000000;
      }
      
      .badge-info {
        background: linear-gradient(135deg, var(--info-500) 0%, var(--info-600) 100%);
        color: #000000;
      }
      
      /* Home page specific dark mode */
      .Home-header {
        background: linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .Home-card {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .Home-card:hover {
        border-color: var(--primary-500);
      }
      
      /* Admin page specific dark mode */
      .stats-card {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .stats-card:hover {
        border-color: var(--primary-500);
      }
      
      /* Text color adjustments */
      .text-muted {
        color: var(--gray-600) !important;
      }
      
      .text-primary {
        color: var(--primary-500) !important;
      }
      
      .text-secondary {
        color: var(--secondary-400) !important;
      }
      
      .text-success {
        color: var(--success-500) !important;
      }
      
      .text-danger {
        color: var(--danger-500) !important;
      }
      
      .text-warning {
        color: var(--warning-500) !important;
      }
      
      .text-info {
        color: var(--info-500) !important;
      }
      
      /* Background color adjustments */
      .bg-white {
        background-color: var(--gray-50) !important;
      }
      
      .bg-light {
        background-color: var(--gray-100) !important;
      }
      
      /* Input group styling */
      .input-group .form-control {
        background: rgba(26, 26, 26, 0.9);
        border-color: var(--gray-300);
        color: var(--black);
      }
      
      .input-group .btn {
        background: var(--gray-200);
        border-color: var(--gray-300);
        color: var(--black);
      }
      
      .input-group .btn:hover {
        background: var(--gray-300);
        color: var(--black);
      }
    }
    
    /* Touch device optimizations */
    @media (hover: none) and (pointer: coarse) {
      .btn:hover {
        transform: none;
        box-shadow: var(--shadow-sm);
      }
      
      .card:hover {
        transform: none;
        box-shadow: var(--shadow-md);
      }
      
      .table tbody tr:hover {
        background: rgba(99, 102, 241, 0.02);
        transform: none;
      }
      
      /* Increase touch targets */
      .btn {
        min-height: 44px;
        min-width: 44px;
      }
      
      .nav-link {
        min-height: 44px;
        padding: 0.75rem 1rem;
      }
      
      .dropdown-item {
        min-height: 44px;
        padding: 0.75rem 1rem;
      }
    }

    /* Responsive Design */


    /* Animation utilities */
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .animate-bounce {
      animation: bounce 1s infinite;
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    .animate-slide-up {
      animation: slideUp 0.5s ease-out;
    }
    .animate-slide-down {
      animation: slideDown 0.5s ease-out;
    }
    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    @keyframes bounce {
      0%,
      100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    /* Hover effects */
    .hover-lift {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .hover-lift:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .progress {
      border-radius: 50rem;
    }
    .progress-bar {
      border-radius: 50rem;
    }
      .align-middle {
      vertical-align: middle !important;

    }
    .table th,
    .table td {
      vertical-align: middle;
    }

    .table-hover tbody tr:hover {
      background-color: rgba(99, 102, 241, 0.05);
      transform: scale(1.01);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: var(--transition);
    }
    .btn-group .btn {
      border-radius: 0;
      border: 1px solid var(--gray-200);
      transition: var(--transition);
    }
    .btn-group .btn.active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    .badge.bg-success {
      background-color: #10b981 !important;
    }
    .badge.bg-warning {
      background-color: #f59e0b !important;
      color: #000;
    }
    .badge.bg-danger {
      background-color: #ef4444 !important;
    }
    .badge.bg-info {
      background-color: #06b6d4 !important;
    }
    .badge.bg-primary {
      background-color: #6366f1 !important;
    }
    .hover-glow {
      transition: var(--transition);
    }
    .hover-glow:hover {
      box-shadow: var(--shadow-glow);
    }
    .hover-scale {
      transition: var(--transition);
    }
    .hover-scale:hover {
      transform: scale(1.05);
    }
    .hover-rotate {
      transition: var(--transition);
    }
    .hover-rotate:hover {
      transform: rotate(5deg);
    }
    /* Focus utilities */
    .focus-ring:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    /* Transition utilities */
    .transition-none {
      transition: none;
    }
    .transition-fast {
      transition: var(--transition-fast);
    }
    .transition {
      transition: var(--transition);
    }
    .transition-slow {
      transition: var(--transition-slow);
    }
    .transition-bounce {
      transition: var(--transition-bounce);
    }
    /* Hamburger Menu */
    .navbar-toggler {
      padding: 0.25rem 0.75rem;
      font-size: 1.25rem;
      line-height: 1;
      background-color: transparent;
      border: 1px solid transparent;
      border-radius: 0.25rem;
      transition: box-shadow 0.15s ease-in-out;
    }
    .navbar-toggler:hover {
      text-decoration: none;
    }
    .navbar-toggler:focus {
      text-decoration: none;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .navbar-toggler-icon {
      display: inline-block;
      width: 1.5em;
      height: 1.5em;
      vertical-align: middle;
      background-image: url("image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
    }
    .navbar-nav {
      display: flex;
      flex-direction: column;
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;
    }
    .navbar-nav .nav-link {
      padding-right: 0;
      padding-left: 0;
    }
    .navbar-nav .dropdown-menu {
      position: static;
      float: none;
    }
    @media (min-width: 992px) {
      .navbar-expand-lg {
        flex-wrap: nowrap;
        justify-content: flex-start;
      }
      .navbar-expand-lg .navbar-nav {
        flex-direction: row;
      }
      .navbar-expand-lg .navbar-nav .nav-link {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
      }
      .navbar-expand-lg .navbar-collapse {
        display: flex !important;
        flex-basis: auto;
      }
      .navbar-expand-lg .navbar-toggler {
        display: none;
      }
    }
    .navbar-light .navbar-brand {
      color: rgba(0, 0, 0, 0.9);
    }
    .navbar-light .navbar-brand:hover,
    .navbar-light .navbar-brand:focus {
      color: rgba(0, 0, 0, 0.9);
    }
    .navbar-light .navbar-nav .nav-link {
      color: rgba(0, 0, 0, 0.5);
    }
    .navbar-light .navbar-nav .nav-link:hover,
    .navbar-light .navbar-nav .nav-link:focus {
      color: rgba(0, 0, 0, 0.7);
    }
    .navbar-light .navbar-nav .nav-link.disabled {
      color: rgba(0, 0, 0, 0.3);
    }
    .navbar-light .navbar-nav .show > .nav-link,
    .navbar-light .navbar-nav .active > .nav-link,
    .navbar-light .navbar-nav .nav-link.show,
    .navbar-light .navbar-nav .nav-link.active {
      color: rgba(0, 0, 0, 0.9);
    }
    .navbar-light .navbar-toggler {
      color: rgba(0, 0, 0, 0.5);
      border-color: rgba(0, 0, 0, 0.1);
    }
    .navbar-light .navbar-toggler-icon {
      background-image: url("image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }
    .navbar-light .navbar-text {
      color: rgba(0, 0, 0, 0.5);
    }
    .navbar-light .navbar-text a {
      color: rgba(0, 0, 0, 0.9);
    }
    .navbar-light .navbar-text a:hover,
    .navbar-light .navbar-text a:focus {
      color: rgba(0, 0, 0, 0.9);
    }
    /* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #000;
  text-align: left;
  list-style: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 0, 0, 0.2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}
    .dropdown-menu.show {
      display: block;
    }
    .dropdown-menu-end {
      --bs-position: end;
      right: 0;
      left: auto;
    }
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 0.25rem 1rem;
      clear: both;
      font-weight: 400;
      color: #444062;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      border: 0;
      text-decoration: none;
      border-radius: var(--radius);
      transition: var(--transition);
    }
    .dropdown-item:hover {
      color:
      background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.05) 0%,
        rgba(139, 92, 246, 0.05) 100%
      );
      transform: translateX(4px);
    }

    /* Enhanced spinner */
    .spinner-border {
      display: inline-flex;
      width: 2rem;
      height: 2rem;
      vertical-align: text-bottom;
      border: 0.25em solid;
      border-color: var(--primary-500) transparent var(--primary-500)
        transparent;
      border-radius: 50%;
      animation: spinner-pulse 1.5s ease-in-out infinite;
    }
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
      border-width: 0.2em;
    }
    @keyframes spinner-pulse {
      0% {
        transform: rotate(0deg) scale(1);
        border-color: var(--primary-500) transparent var(--primary-500)
          transparent;
      }
      50% {
        transform: rotate(180deg) scale(1.1);
        border-color: var(--warning-500) transparent var(--warning-500)
          transparent;
      }
      100% {
        transform: rotate(360deg) scale(1);
        border-color: var(--primary-500) transparent var(--primary-500)
          transparent;
      }
    }
    /* Utility Classes */
    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .text-left {
      text-align: left;
    }
    .text-muted {
      color: #000;
    }
    .text-white {
      color: var(--white);
    }
    .text-primary {
      color: var(--primary-600);
    }
    .text-secondary {
      color: var(--secondary-600);
    }
    .text-success {
      color: var(--success-600);
    }
    .text-danger {
      color: var(--danger-600);
    }
    .text-warning {
      color: var(--warning-600);
    }
    .text-info {
      color: var(--info-600);
    }
    .bg-white {
      background-color: var(--white);
    }
    .bg-light {
      background: #08ff001c;
    }
    .bg-primary {
      background: var(--gradient-primary);
    }
    .bg-secondary {
      background: var(--secondary-100);
    }
    .bg-glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .fw-bold {
      font-weight: 700;
      font-size: 20px;
    }
    .fw-semibold {
      font-weight: 600;
    }
    .fw-medium {
      font-weight: 500;
    }
    .fw-normal {
      font-weight: 400;
    }
    .fw-light {
      font-weight: 300;
    }
    .fs-1 {
      font-size: 2.5rem;
      line-height: 1.2;
    }
    .fs-2 {
      font-size: 2rem;
      line-height: 1.25;
    }
    .fs-3 {
      font-size: 1.75rem;
      line-height: 1.3;
    }
    .fs-4 {
      font-size: 1.5rem;
      line-height: 1.35;
    }
    .fs-5 {
      font-size: 1.25rem;
      line-height: 1.4;
    }
    .fs-6 {
      font-size: 1rem;
      line-height: 1.5;
    }
    /* Spacing utilities */
    .m-0 {
      margin: 0;
    }
    .m-1 {
      margin: var(--space-1);
    }
    .m-2 {
      margin: var(--space-2);
    }
    .m-3 {
      margin: var(--space-3);
    }
    .m-4 {
      margin: var(--space-4);
    }
    .m-5 {
      margin: var(--space-5);
    }
    .m-6 {
      margin: var(--space-6);
    }
    .m-8 {
      margin: var(--space-8);
    }
    .mb-0 {
      margin-bottom: 0;
    }
    .mb-1 {
      margin-bottom: var(--space-1);
    }
    .mb-2 {
      margin-bottom: var(--space-2);
    }
    .mb-3 {
      margin-bottom: var(--space-3);
    }
    .mb-4 {
      margin-bottom: var(--space-4);
    }
    .mb-5 {
      margin-bottom: var(--space-5);
    }
    .mb-6 {
      margin-bottom: var(--space-6);
    }
    .mb-8 {
      margin-bottom: var(--space-8);
    }
    .mt-0 {
      margin-top: 0;
    }
    .mt-1 {
      margin-top: var(--space-1);
    }
    .mt-2 {
      margin-top: var(--space-2);
    }
    .mt-3 {
      margin-top: var(--space-3);
    }
    .mt-4 {
      margin-top: var(--space-4);
    }
    .mt-5 {
      margin-top: var(--space-5);
    }
    .mt-6 {
      margin-top: var(--space-6);
    }
    .mt-8 {
      margin-top: var(--space-8);
    }
    .p-0 {
      padding: 0;
    }
    .p-1 {
      padding: var(--space-1);
    }
    .p-2 {
      padding: var(--space-2);
    }
    .p-3 {
      padding: var(--space-3);
    }
    .p-4 {
      padding: var(--space-4);
    }
    .p-5 {
      padding: var(--space-5);
    }
    .p-6 {
      padding: var(--space-6);
    }
    .p-8 {
      padding: var(--space-8);
    }
    .py-1 {
      padding-top: var(--space-1);
      padding-bottom: var(--space-1);
    }
    .py-2 {
      padding-top: var(--space-2);
      padding-bottom: var(--space-2);
    }
    .py-3 {
      padding-top: var(--space-3);
      padding-bottom: var(--space-3);
    }
    .py-4 {
      padding-top: var(--space-4);
      padding-bottom: var(--space-4);
    }
    .py-5 {
      padding-top: var(--space-5);
      padding-bottom: var(--space-5);
    }
    .py-6 {
      padding-top: var(--space-6);
      padding-bottom: var(--space-6);
    }
    .py-8 {
      padding-top: var(--space-8);
      padding-bottom: var(--space-8);
    }
    .px-1 {
      padding-left: var(--space-1);
      padding-right: var(--space-1);
    }
    .px-2 {
      padding-left: var(--space-2);
      padding-right: var(--space-2);
    }
    .px-3 {
      padding-left: var(--space-3);
      padding-right: var(--space-3);
    }
    .px-4 {
      padding-left: var(--space-4);
      padding-right: var(--space-4);
    }
    .px-5 {
      padding-left: var(--space-5);
      padding-right: var(--space-5);
    }
    .px-6 {
      padding-left: var(--space-6);
      padding-right: var(--space-6);
    }
    .px-8 {
      padding-left: var(--space-8);
      padding-right: var(--space-8);
    }
    /* Flexbox utilities */
    .d-flex {
      display: flex;
    }
    .d-inline-flex {
      display: inline-flex;
    }
    .d-grid {
      display: grid;
    }
    .d-block {
      display: block;
    }
    .d-none {
      display: none;
    }
    .justify-content-start {
      justify-content: flex-start;
    }
    .justify-content-end {
      justify-content: flex-end;
    }
    .justify-content-center {
      justify-content: center;
    }
    .justify-content-between {
      justify-content: space-between;
    }
    .justify-content-around {
      justify-content: space-around;
    }
    .justify-content-evenly {
      justify-content: space-evenly;
    }
    .align-items-start {
      align-items: flex-start;
    }
    .align-items-end {
      align-items: flex-end;
    }
    .align-items-center {
      align-items: center;
    }
    .align-items-baseline {
      align-items: baseline;
    }
    .align-items-stretch {
      align-items: stretch;
    }
    .flex-row {
      flex-direction: row;
    }
    .flex-column {
      flex-direction: column;
    }
    .flex-wrap {
      flex-wrap: wrap;
    }
    .flex-nowrap {
      flex-wrap: nowrap;
    }
    /* Size utilities */
    .w-100 {
      width: 100%;
    }
    .w-75 {
      width: 75%;
    }
    .w-50 {
      width: 50%;
    }
    .w-25 {
      width: 25%;
    }
    .h-100 {
      height: 100%;
    }
    .h-75 {
      height: 75%;
    }
    .h-50 {
      height: 50%;
    }
    .h-25 {
      height: 25%;
    }
    /* Shadow utilities */
    .shadow-none {
      box-shadow: none;
    }
    .shadow-xs {
      box-shadow: var(--shadow-xs);
    }
    .shadow-sm {
      box-shadow: var(--shadow-sm);
    }
    .shadow {
      box-shadow: var(--shadow);
    }
    .shadow-md {
      box-shadow: var(--shadow-md);
    }
    .shadow-lg {
      box-shadow: var(--shadow-lg);
    }
    .shadow-xl {
      box-shadow: var(--shadow-xl);
    }
    .shadow-2xl {
      box-shadow: var(--shadow-2xl);
    }
    .shadow-inner {
      box-shadow: var(--shadow-inner);
    }
    .shadow-glow {
      box-shadow: var(--shadow-glow);
    }
    /* Border radius utilities */
    .rounded-none {
      border-radius: 0;
    }
    .rounded-sm {
      border-radius: var(--radius-sm);
    }
    .rounded {
      border-radius: var(--radius);
    }
    .rounded-md {
      border-radius: var(--radius-md);
    }
    .rounded-lg {
      border-radius: var(--radius-lg);
    }
    .rounded-xl {
      border-radius: var(--radius-xl);
    }
    .rounded-2xl {
      border-radius: var(--radius-2xl);
    }
    .rounded-full {
      border-radius: var(--radius-full);
    }
    /* Interactive utilities */
    .cursor-pointer {
      cursor: pointer;
    }
    .cursor-not-allowed {
      cursor: not-allowed;
    }
    .cursor-default {
      cursor: default;
    }
    /* Gap utilities */
    .gap-1 {
      gap: var(--space-1);
    }
    .gap-2 {
      gap: var(--space-2);
    }
    .gap-3 {
      gap: var(--space-3);
    }
    .gap-4 {
      gap: var(--space-4);
    }
    .gap-5 {
      gap: var(--space-5);
    }
    .gap-6 {
      gap: var(--space-6);
    }
    .gap-8 {
      gap: var(--space-8);
    }
    /* Position utilities */
    .position-relative {
      position: relative;
    }
    .position-absolute {
      position: absolute;
    }
    .position-fixed {
      position: fixed;
    }

    /* Overflow utilities */
    .overflow-hidden {
      overflow: hidden;
    }
    .overflow-auto {
      overflow: auto;
    }
    .overflow-scroll {
      overflow: scroll;
    }
    /* Accessibility */
    .visually-hidden {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
    /* Responsive Design */
    @media (max-width: 767.98px) {
      .offcanvas-start {
        width: 240px;
      }
    }
    @media (min-width: 992px) {
      .navbar-expand-lg .navbar-toggler {
        display: none;
      }
    }
    /* Additional styles for LOTOList component */
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    /* Status Pills */
    .status-pill {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .status-pill.success {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 2px solid rgba(16, 185, 129, 0.3);
    }
    .status-pill.warning {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 2px solid rgba(245, 158, 11, 0.3);
    }
    .status-pill.danger {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 2px solid rgba(239, 68, 68, 0.3);
    }
    .status-pill:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    /* Form Group */
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-label {
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 0.5rem;
      font-size: 20px;
      line-height: 1.5;
      display: block;
      transition: color 0.2s ease;
    }

    .form-control {
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }
    .form-control:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }
    /* Progress Bars */
    .progress-container {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-track {
      width: 100%;
      height: 100%;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .progress-fill.success {
      background: linear-gradient(90deg, #10b981, #059669);
    }
    .progress-fill.warning {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }
    .progress-fill.danger {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }
    .progress-fill.primary {
      background: linear-gradient(90deg, #6366f1, #4f46e5);
    }
    .progress-fill.info {
      background: linear-gradient(90deg, #06b6d4, #0891b2);
    }
    /* Additional responsive utilities */
    .responsive-text {
      font-size: clamp(0.875rem, 2.5vw, 1rem);
    }
    
    .responsive-heading {
      font-size: clamp(1.25rem, 4vw, 2rem);
    }
    
    .responsive-padding {
      padding: clamp(1rem, 3vw, 2rem);
    }
    
    .responsive-margin {
      margin: clamp(0.5rem, 2vw, 1.5rem);
    }
    
    /* Container utilities for better laptop/desktop usage */
    .container-fluid {
      width: 100%;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .container-xl {
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding-left: 2rem;
      padding-right: 2rem;
    }
    
    .container-xxl {
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
      padding-left: 3rem;
      padding-right: 3rem;
    }
    
    /* Full-width sections */
    .full-width {
      width: 100vw;
      margin-left: calc(-50vw + 50%);
      margin-right: calc(-50vw + 50%);
    }
    
    /* Better table containers for laptops */
    .table-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 0.75rem;
      box-shadow: var(--shadow-md);
    }
    
    .table-container .table {
      margin-bottom: 0;
      min-width: 100%;
    }
    
    /* Container queries support (when available) */
    @supports (container-type: inline-size) {
      .card-container {
        container-type: inline-size;
      }
      
      @container (max-width: 300px) {
        .card-content {
          padding: 0.75rem;
        }
        
        .card-title {
          font-size: 1rem;
        }
      }
    }
    /* ============ Modern Header Styles ============ */
    
    .modern-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .header-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .header-brand:hover {
      transform: translateY(-1px);
    }
    
    .brand-logo {
      display: flex;
      align-items: center;
    }
    
    .navbar-pepsico-logo {
      height: 50px;
      width: auto;
      max-width: 140px;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    
    .brand-text {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
  
    
    .brand-title h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
    }
    
    .brand-subtitle {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .header-dropdown {
      position: relative;
    }
    
    .notification-btn {
      position: relative;
      width: 44px;
      height: 44px;
      border: none;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #6366f1;
    }
    
    .notification-btn:hover {
      background: rgba(99, 102, 241, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
    }
    
    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      border: none;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .user-btn:hover {
      background: rgba(255, 255, 255, 1);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    }
    
    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .user-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 0.875rem;
      line-height: 1.2;
    }
    
    .user-role {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: capitalize;
    }
    
    .chevron {
      font-size: 0.75rem;
      color: #6b7280;
      transition: transform 0.3s ease;
    }
    
    .user-btn:hover .chevron {
      transform: rotate(180deg);
    }
    
    .modern-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      min-width: 280px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .modern-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-header {
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .dropdown-divider {
      height: 1px;
      background: rgba(0, 0, 0, 0.1);
      margin: 0.5rem 0;
    }
    
    .dropdown-item {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #374151;
      font-size: 0.875rem;
    }
    
    .dropdown-item:hover {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }
    
    .dropdown-item.logout-item {
      color: #ef4444;
    }
    
    .dropdown-item.logout-item:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }
    
    /* ============ PepsiCo Logo Styles ============ */
    
    /* Login Page Background */
    .login-page-container {
      position: relative;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    
    .login-page-container::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('https://logos-world.net/wp-content/uploads/2022/03/Pepsico-Symbol.png');
      background-size: 300px auto;
      background-repeat: no-repeat;
      background-position: center top;
      background-attachment: fixed;
      opacity: 0.1;
      z-index: 0;
    }
    
    .login-page-container .row {
      position: relative;
      z-index: 1;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    /* Responsive header styles */
    @media (max-width: 768px) {
      .header-container {
        padding: 0.75rem 1rem;
      }
      
      .navbar-pepsico-logo {
        height: 40px;
        max-width: 100px;
      }
      
      .brand-title h1 {
        font-size: 1.25rem;
      }
      
      .brand-subtitle {
        font-size: 0.625rem;
      }
      
 
      
      .user-btn {
        padding: 0.375rem 0.75rem;
        gap: 0.5rem;
      }
      
      .user-info {
        display: none;
      }
      
      .modern-dropdown {
        min-width: 240px;
      }
    }
    
    @media (max-width: 576px) {
      .header-container {
        padding: 0.5rem 0.75rem;
      }
      
      .navbar-pepsico-logo {
        height: 35px;
        max-width: 80px;
      }
      
      .brand-title h1 {
        font-size: 1.125rem;
      }
      
      .brand-subtitle {
        display: none;
      }
      
 
      
      .user-btn {
        padding: 0.25rem 0.5rem;
      }
      
      .user-avatar {
        width: 28px;
        height: 28px;
        font-size: 0.875rem;
      }
      
      .modern-dropdown {
        min-width: 200px;
      }
    }
    
    /* Responsive logo sizing */
    @media (max-width: 768px) {
      .login-page-container::before {
        background-size: 200px auto;
        opacity: 0.08;
      }
    }
    
    @media (max-width: 576px) {
      .login-page-container::before {
        background-size: 150px auto;
        opacity: 0.06;
      }
    }
    
    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .modern-header {
        background: rgba(26, 26, 26, 0.95);
        border-bottom-color: rgba(255, 255, 255, 0.1);
      }
      
      .brand-title h1 {
        background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .brand-subtitle {
        color: #9ca3af;
      }
      
      .user-btn {
        background: rgba(55, 65, 81, 0.8);
      }
      
      .user-btn:hover {
        background: rgba(55, 65, 81, 1);
      }
      
      .user-name {
        color: #f9fafb;
      }
      
      .user-role {
        color: #9ca3af;
      }
      
      .modern-dropdown {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .dropdown-item {
        color: #e5e7eb;
      }
      
      .dropdown-item:hover {
        background: rgba(99, 102, 241, 0.2);
        color: #a5b4fc;
      }
      
      .login-page-container {
        background: linear-gradient(135deg, #1a1a1a 0%, #262626 100%);
      }
      
      .login-page-container::before {
        opacity: 0.05;
      }
      
      .login-card {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .navbar-pepsico-logo {
        filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1));
      }
    }

    /* ============ Modern Statistics Dashboard ============ */
    
    .modern-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .stat-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .stat-card.active {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      border: 2px solid #6366f1;
    }
    
    .stat-card.active .stat-number {
      color: #6366f1;
      font-weight: 700;
    }
    
    .stat-card.active .stat-label {
      color: #6366f1;
      font-weight: 600;
    }
    
    .stat-card.total-card::before {
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
    }
    
    .stat-card.active-card::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }
    
    .stat-card.pending-card::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }
    
    .stat-card.completed-card::before {
      background: linear-gradient(90deg, #06b6d4, #0891b2);
    }
    
    .stat-icon {
      margin-bottom: 1rem;
    }
    
    .icon-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    
    .total-card .icon-wrapper {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }
    
    .active-card .icon-wrapper {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    
    .pending-card .icon-wrapper {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    
    .completed-card .icon-wrapper {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    }
    
    .stat-svg {
      width: 28px;
      height: 28px;
      color: white;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
    
    .stat-content {
      margin-bottom: 1rem;
    }
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .stat-label {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .stat-description {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }
    
    .stat-trend {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    
    .trend-indicator {
      font-size: 1.25rem;
      opacity: 0.7;
      transition: all 0.3s ease;
    }
    
    .stat-card:hover .trend-indicator {
      opacity: 1;
      transform: scale(1.1);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .modern-stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
      
      .stat-card {
        padding: 1.25rem;
      }
      
      .stat-number {
        font-size: 2rem;
      }
      
      .icon-wrapper {
        width: 50px;
        height: 50px;
      }
      
      .stat-svg {
        width: 24px;
        height: 24px;
      }
    }
    
    @media (max-width: 576px) {
      .modern-stats-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      
      .stat-card {
        padding: 1rem;
      }
      
      .stat-number {
        font-size: 1.75rem;
      }
      
      .stat-label {
        font-size: 1rem;
      }
      
      .stat-description {
        font-size: 0.8rem;
      }
    }
    
    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .stat-card {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .stat-number {
        background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .stat-label {
        color: #f9fafb;
      }
      
      .stat-description {
        color: #9ca3af;
      }
      
      .stat-card.active {
        border-color: #818cf8;
      }
      
      .stat-card.active .stat-number {
        color: #818cf8;
      }
      
      .stat-card.active .stat-label {
        color: #a5b4fc;
      }
    }

    /* ============ Modern Create LOTO Styles ============ */
    
    .create-loto-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .create-loto-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .header-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    

    
    .header-svg {
      width: 28px;
      height: 28px;
      color: white;
    }
    
    .brand-text h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .brand-text p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .action-btn.primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
    }
    
    .action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(99, 102, 241, 0.4);
    }
    
    .action-btn.secondary {
      background: rgba(107, 114, 128, 0.1);
      color: #374151;
      border: 1px solid rgba(107, 114, 128, 0.2);
    }
    
    .action-btn.secondary:hover {
      background: rgba(107, 114, 128, 0.2);
      transform: translateY(-1px);
    }
    
    .btn-icon {
      width: 16px;
      height: 16px;
    }
    
    .modern-error-alert {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .error-icon {
      width: 40px;
      height: 40px;
      background: rgba(239, 68, 68, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .error-svg {
      width: 20px;
      height: 20px;
      color: #ef4444;
    }
    
    .error-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #dc2626;
      margin: 0 0 0.5rem 0;
    }
    
    .error-content p {
      color: #7f1d1d;
      margin: 0;
    }
    
    .modern-form-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .form-section {
      margin-bottom: 3rem;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(99, 102, 241, 0.1);
    }
    
    .section-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
    }
    
    .section-svg {
      width: 24px;
      height: 24px;
      color: white;
    }
    
    .section-title h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }
    
    .section-title p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
      .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .modern-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    .modern-input-wrapper,
    .modern-select-wrapper {
      position: relative;
    }
    
    .modern-input,
    .modern-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .modern-input:focus,
    .modern-select:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      transform: translateY(-1px);
    }
    
    .location-flow {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .flow-step {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 1rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .step-number {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      flex-shrink: 0;
    }
    
    .step-content {
      flex: 1;
    }
    
    .step-content .modern-label {
      margin-bottom: 0.75rem;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .create-loto-container {
        padding: 1rem;
      }
      
      .create-loto-header {
        padding: 1.5rem;
      }
      
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .brand-text h1 {
        font-size: 1.5rem;
      }
      
      .modern-form-container {
        padding: 1.5rem;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .flow-step {
        padding: 1rem;
      }
    }
    
    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .create-loto-header {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .brand-text h1 {
        background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .brand-text p {
        color: #9ca3af;
      }
      
      .modern-form-container {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .section-title h3 {
        color: #f9fafb;
      }
      
      .section-title p {
        color: #9ca3af;
      }
      
      .modern-label {
        color: #e5e7eb;
      }
      
      .modern-input,
      .modern-select {
        background: rgba(55, 65, 81, 0.9);
        border-color: #4b5563;
        color: #f9fafb;
      }
      
      .modern-input:focus,
      .modern-select:focus {
        border-color: #818cf8;
        box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
      }
      
      .flow-step {
        background: rgba(55, 65, 81, 0.5);
        border-color: rgba(75, 85, 99, 0.5);
      }
    }

    /* ============ Modern LOTO Details Styles ============ */
    
    .loto-details-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .loto-details-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .loto-details-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    
    .main-info-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .info-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(99, 102, 241, 0.1);
    }
    
    .info-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
    }
    
    .info-svg {
      width: 24px;
      height: 24px;
      color: white;
    }
    
    .info-title h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }
    
    .info-title p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .status-badge-container {
      margin-left: auto;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .info-group {
      background: rgba(249, 250, 251, 0.8);
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .group-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(99, 102, 241, 0.1);
    }
    
    .info-items {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
    }
    
    .info-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
    }
    
    .info-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
    }
    
    .info-value.location-path {
      color: #3b82f6;
    }
    
    .info-value.supervisor-assigned {
      color: #10b981;
    }
    
    .info-value.no-supervisor {
      color: #6b7280;
    }
    
    .energy-types-section {
      margin-bottom: 2rem;
    }
    
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 1rem 0;
    }
    
    .energy-types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .energy-type-card {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 0.75rem;
      padding: 1rem;
      transition: all 0.3s ease;
    }
    
    .energy-type-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
    }
    
    .energy-type-header {
      margin-bottom: 0.5rem;
    }
    
    .energy-type-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6366f1;
      background: rgba(99, 102, 241, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
    }
    
    .energy-type-content {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .isolation-point {
      font-weight: 500;
    }
    
    .no-energy-types {
      text-align: center;
      padding: 2rem;
      color: #9ca3af;
      font-style: italic;
    }
    
    .additional-info-sections {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .info-section {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .info-section.verified-section {
      background: rgba(16, 185, 129, 0.05);
      border-color: rgba(16, 185, 129, 0.2);
    }
    
    .info-section.handover-section {
      background: rgba(6, 182, 212, 0.05);
      border-color: rgba(6, 182, 212, 0.2);
    }
    
    .info-section.completion-section {
      background: rgba(16, 185, 129, 0.05);
      border-color: rgba(16, 185, 129, 0.2);
    }
    
    .info-section.finish-section {
      background: rgba(107, 114, 128, 0.05);
      border-color: rgba(107, 114, 128, 0.2);
    }
    
    .section-icon {
      width: 40px;
      height: 40px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .verified-section .section-icon {
      background: rgba(16, 185, 129, 0.1);
    }
    
    .handover-section .section-icon {
      background: rgba(6, 182, 212, 0.1);
    }
    
    .completion-section .section-icon {
      background: rgba(16, 185, 129, 0.1);
    }
    
    .finish-section .section-icon {
      background: rgba(107, 114, 128, 0.1);
    }
    
    .section-svg {
      width: 20px;
      height: 20px;
    }
    
    .verified-section .section-svg {
      color: #10b981;
    }
    
    .handover-section .section-svg {
      color: #06b6d4;
    }
    
    .completion-section .section-svg {
      color: #10b981;
    }
    
    .finish-section .section-svg {
      color: #6b7280;
    }
    
    .section-content {
      flex: 1;
    }
    
    .section-content h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .verification-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .verifier-name {
      font-weight: 600;
      color: #1f2937;
    }
    
    .verification-time {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .notes-text {
      font-size: 0.875rem;
      color: #374151;
      line-height: 1.5;
      margin: 0;
    }
    
    .finish-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .finish-time {
      font-weight: 600;
      color: #1f2937;
    }
    
    .finish-date {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .actions-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }
    
    .actions-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(99, 102, 241, 0.1);
    }
    
    .actions-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
    }
    
    .actions-svg {
      width: 24px;
      height: 24px;
      color: white;
    }
    
    .actions-title h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }
    
    .actions-title p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .actions-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .action-group {
      padding: 1.5rem;
      border-radius: 1rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .action-group.handover-group {
      background: rgba(6, 182, 212, 0.05);
      border-color: rgba(6, 182, 212, 0.2);
    }
    
    .action-group.verification-group {
      background: rgba(245, 158, 11, 0.05);
      border-color: rgba(245, 158, 11, 0.2);
    }
    
    .action-group.technician-group {
      background: rgba(99, 102, 241, 0.05);
      border-color: rgba(99, 102, 241, 0.2);
    }
    
    .action-group.update-group {
      background: rgba(99, 102, 241, 0.05);
      border-color: rgba(99, 102, 241, 0.2);
    }
    
    .action-group.supervisor-group {
      background: rgba(16, 185, 129, 0.05);
      border-color: rgba(16, 185, 129, 0.2);
    }
    
    .action-group.delete-group {
      background: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.2);
    }
    
    .action-header {
        margin-bottom: 1rem;
      }
    
    .action-header h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .action-header p {
        font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }
    
    .action-button-container {
      margin-top: 1rem;
    }
    
    .action-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      flex: 1;
      justify-content: center;
    }
    
    .action-button.primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
    }
    
    .action-button.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(99, 102, 241, 0.4);
    }
    
    .action-button.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
    }
    
    .action-button.success:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(16, 185, 129, 0.4);
    }
    
    .action-button.info {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(6, 182, 212, 0.3);
    }
    
    .action-button.info:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(6, 182, 212, 0.4);
    }
    
    .action-button.danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
    }
    
    .action-button.danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(239, 68, 68, 0.4);
    }
    
    .action-button.full-width {
      width: 100%;
    }
    
    .status-info-section {
      padding: 1.5rem;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 1rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .status-header h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    
    .status-badge-large {
      font-size: 0.875rem;
    }
    
    .status-description {
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.5;
    }
    
    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .loto-details-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .actions-section {
        order: -1;
      }
    }
    
    @media (max-width: 768px) {
      .loto-details-container {
        padding: 1rem;
      }
      
      .loto-details-header {
        padding: 1.5rem;
      }
      
      .main-info-section,
      .actions-section {
        padding: 1.5rem;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .energy-types-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .action-button {
        width: 100%;
      }
      
      .action-button-container {
        margin-top: 0.75rem;
      }
    }
    
    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .loto-details-header,
      .main-info-section,
      .actions-section {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .info-title h3,
      .actions-title h3 {
        color: #f9fafb;
      }
      
      .info-title p,
      .actions-title p {
        color: #9ca3af;
      }
      
      .group-title {
        color: #e5e7eb;
      }
      
      .info-label {
        color: #9ca3af;
      }
      
      .info-value {
        color: #f9fafb;
      }
      
      .info-group,
      .status-info-section {
        background: rgba(55, 65, 81, 0.5);
        border-color: rgba(75, 85, 99, 0.5);
      }
      
      .energy-type-card {
        background: rgba(55, 65, 81, 0.8);
        border-color: rgba(99, 102, 241, 0.3);
      }
      
      .action-group {
        background: rgba(55, 65, 81, 0.3);
        border-color: rgba(75, 85, 99, 0.5);
      }
      
      .action-header h5 {
        color: #f9fafb;
      }
      
      .action-header p {
        color: #9ca3af;
      }
      
      .status-header h5 {
        color: #f9fafb;
      }
      
      .status-description {
        color: #9ca3af;
      }
    }

    /* ============ Modern Data Export Styles ============ */
    
    .data-export-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .data-export-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .access-denied {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .access-icon {
      width: 80px;
      height: 80px;
      background: rgba(239, 68, 68, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
    }
    
    .access-svg {
      width: 40px;
      height: 40px;
      color: #ef4444;
    }
    
    .access-denied h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }
    
    .access-denied p {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }
    
    .export-options-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .modern-success-alert {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .success-icon {
      width: 40px;
      height: 40px;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .success-svg {
      width: 20px;
      height: 20px;
      color: #10b981;
    }
    
    .success-content h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #059669;
      margin: 0 0 0.5rem 0;
    }
    
    .success-content p {
      color: #065f46;
      margin: 0;
    }
    
    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .option-group {
      background: rgba(249, 250, 251, 0.8);
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .group-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(99, 102, 241, 0.1);
    }
    
    .format-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .format-option {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 2px solid rgba(229, 231, 235, 0.5);
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .format-option:hover {
      border-color: rgba(99, 102, 241, 0.3);
      background: rgba(99, 102, 241, 0.05);
    }
    
    .format-option input[type="radio"] {
      margin-right: 1rem;
      width: 18px;
      height: 18px;
      accent-color: #6366f1;
    }
    
    .format-option input[type="radio"]:checked + .option-content {
      color: #6366f1;
    }
    
    .format-option:has(input[type="radio"]:checked) {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.1);
    }
    
    .option-content {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }
    
    .option-icon {
      width: 40px;
      height: 40px;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .option-svg {
      width: 20px;
      height: 20px;
      color: #6366f1;
    }
    
    .option-text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .option-name {
      font-weight: 600;
      color: #1f2937;
    }
    
    .option-description {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .date-options,
    .status-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .date-option,
    .status-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .date-option:hover,
    .status-option:hover {
      background: rgba(99, 102, 241, 0.05);
    }
    
    .date-option input[type="radio"],
    .status-option input[type="radio"] {
      width: 16px;
      height: 16px;
      accent-color: #6366f1;
    }
    
    .date-option:has(input[type="radio"]:checked),
    .status-option:has(input[type="radio"]:checked) {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }
    
    .custom-date-range {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 0.75rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .date-input-group {
      margin-bottom: 1rem;
    }
    
    .date-input-group:last-child {
      margin-bottom: 0;
    }
    
    .date-input-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    .checkbox-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .checkbox-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .checkbox-option:hover {
      background: rgba(99, 102, 241, 0.05);
    }
    
    .checkbox-option input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #6366f1;
    }
    
    .checkbox-option:has(input[type="checkbox"]:checked) {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }
    
    .export-actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }
    
    .export-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      border: none;
      border-radius: 1rem;
      font-weight: 600;
      font-size: 1.125rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      min-width: 200px;
      justify-content: center;
    }
    
    .export-btn.primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
    }
    
    .export-btn.primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 12px rgba(99, 102, 241, 0.4);
    }
    
    .export-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .spinner-border-sm {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .data-export-container {
        padding: 1rem;
      }
      
      .data-export-header,
      .export-options-section {
        padding: 1.5rem;
      }
      
      .options-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .format-options {
        gap: 0.75rem;
      }
      
      .format-option {
        padding: 0.75rem;
      }
      
      .option-content {
        gap: 0.75rem;
      }
      
      .option-icon {
        width: 32px;
        height: 32px;
      }
      
      .option-svg {
        width: 16px;
        height: 16px;
      }
      
      .export-btn {
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
        min-width: 180px;
      }
    }
    
    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .data-export-header,
      .export-options-section,
      .access-denied {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .access-denied h2 {
        color: #f9fafb;
      }
      
      .access-denied p {
        color: #9ca3af;
      }
      
      .group-title {
        color: #e5e7eb;
      }
      
      .option-group {
        background: rgba(55, 65, 81, 0.5);
        border-color: rgba(75, 85, 99, 0.5);
      }
      
      .format-option {
        border-color: rgba(75, 85, 99, 0.5);
      }
      
      .format-option:hover {
        border-color: rgba(129, 140, 248, 0.3);
        background: rgba(129, 140, 248, 0.05);
      }
      
      .format-option:has(input[type="radio"]:checked) {
        border-color: #818cf8;
        background: rgba(129, 140, 248, 0.1);
      }
      
      .option-name {
        color: #f9fafb;
      }
      
      .option-description {
        color: #9ca3af;
      }
      
      .date-option:hover,
      .status-option:hover,
      .checkbox-option:hover {
        background: rgba(129, 140, 248, 0.05);
      }
      
      .date-option:has(input[type="radio"]:checked),
      .status-option:has(input[type="radio"]:checked),
      .checkbox-option:has(input[type="checkbox"]:checked) {
        background: rgba(129, 140, 248, 0.1);
        color: #a5b4fc;
      }
      
      .custom-date-range {
        background: rgba(55, 65, 81, 0.8);
        border-color: rgba(75, 85, 99, 0.5);
      }
      
      .date-input-group label {
        color: #e5e7eb;
      }
    }

    /* ============ Modern Monitoring Dashboard Styles ============ */
    
    .monitoring-dashboard-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .dashboard-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .spinner-border-lg {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(99, 102, 241, 0.1);
      border-top: 4px solid #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 2rem;
    }
    
    .loading-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .loading-state p {
      color: #6b7280;
      margin: 0;
    }
    
    .last-updated {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }
    
    .update-label {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .update-time {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .metric-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .metric-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    }
    
    .metric-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .metric-card.total-card::before {
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
    }
    
    .metric-card.active-card::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }
    
    .metric-card.users-card::before {
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    }
    
    .metric-card.safety-card::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }
    
    .metric-icon {
      width: 60px;
      height: 60px;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    
    .metric-svg {
      width: 30px;
      height: 30px;
      color: #6366f1;
    }
    
    .metric-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .metric-number {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }
    
    .metric-label {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
    }
    
    .metric-description {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .chart-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .chart-header {
      margin-bottom: 1.5rem;
    }
    
    .chart-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .chart-header p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .chart-container {
      width: 100%;
      height: 300px;
    }
    
    .alerts-health-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .alerts-card,
    .health-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      margin-bottom: 1.5rem;
    }
    
    .card-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .card-header p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .alert-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 0.75rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .alert-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    
    .alert-content {
      flex: 1;
    }
    
    .alert-title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .alert-message {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .alert-count {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }
    
    .no-alerts {
      text-align: center;
      padding: 2rem;
    }
    
    .no-alerts-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .no-alerts-text {
      color: #6b7280;
      font-weight: 500;
    }
    
    .health-metrics {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .health-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 0.75rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .health-label {
      font-weight: 500;
      color: #374151;
    }
    
    .health-value {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #1f2937;
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
    }
    
    .status-healthy .status-indicator {
      background: #10b981;
    }
    
    .performance-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .performance-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .performance-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .performance-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 0.75rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
      text-align: center;
    }
    
    .performance-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }
    
    .performance-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .monitoring-dashboard-container {
        padding: 1rem;
      }
      
      .dashboard-header,
      .chart-card,
      .alerts-card,
      .health-card,
      .performance-card {
        padding: 1.5rem;
      }
      
      .metrics-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .alerts-health-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .performance-metrics {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
      
      .metric-number {
        font-size: 2rem;
      }
      
      .chart-container {
        height: 250px;
      }
    }
    
    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .dashboard-header,
      .loading-state,
      .chart-card,
      .alerts-card,
      .health-card,
      .performance-card,
      .metric-card {
        background: rgba(26, 26, 26, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .loading-state h3,
      .chart-header h3,
      .card-header h3,
      .metric-label,
      .alert-title,
      .health-label,
      .performance-value,
      .update-time {
        color: #f9fafb;
      }
      
      .loading-state p,
      .chart-header p,
      .card-header p,
      .metric-description,
      .alert-message,
      .update-label {
        color: #9ca3af;
      }
      
      .metric-number {
        background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .alert-item,
      .health-item,
      .performance-item {
        background: rgba(55, 65, 81, 0.5);
        border-color: rgba(75, 85, 99, 0.5);
      }
      
      .alert-count,
      .health-value {
        color: #f9fafb;
      }
    }

    /* ============ Home STYLES ============ */
    
    .Home-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    @media (min-width: 768px) {
      .Home-container {
        padding: 2rem 2rem;
      }
    }
    
    @media (min-width: 1200px) {
      .Home-container {
        padding: 3rem 3rem;
      }
    }

    .Home-header {
      background: linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%);
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 3rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .header-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logo-text {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .logo-text h1 {
      font-size: 30px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .lock-icon {
      font-size: 2rem;
      color: #3b82f6;
    }
    .header-time {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .clock-icon {
      font-size: 1.2rem;
      color: #6b7280;
    }
    .current-time {
      font-weight: 600;
      font-size: 1.25rem;
      color: #1f2937;
    }
    .current-date {
      font-size: 0.875rem;
      color: #6b7280;
    }
    .welcome-message {
      font-size: 0.875rem;
      color: #1f2937;
      line-height: 1.5;
      font-weight: 500;
    }
    .Home-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .Home-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border: 1px solid #e5e7eb;
      cursor: pointer;
    }
    .Home-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      border-color: #3b82f6;
    }
    .card-icon {
      width: 70px;
      height: 70px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: white;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .card-content h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #1f2937;
    }
    .card-content p {
      font-size: 0.875rem;
      color: #6b7280;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .btn-get-started {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      width: 100%;
    }
    .btn-get-started:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    /* Responsive Design */

      .Home-header {
        padding: 1.5rem;
      }
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      .header-time {
        margin-top: 0.5rem;
      }
      .Home-cards {
        gap: 1.5rem;
      }
      .Home-card {
        padding: 1.5rem;
      }
    }
    /* ============ Admin Page STYLES ============ */
    .stats-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border: 1px solid #e5e7eb;
    }
    .stats-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
    .stats-icon-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      margin-bottom: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .stats-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    .stats-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.75rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .status-pill:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
    }
    .empty-state-icon {
      font-size: 3rem;
      color: #94a3b8;
      margin-bottom: 1rem;
    }
    .empty-state-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }
    .empty-state-text {
      font-size: 1rem;
      color: #6b7280;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .form-control {
      border: 2px solid #e2e8f0;
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }
    .form-control:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }
    /* LOTO Table - Responsive */
    .loto-table-wrapper {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin-bottom: var(--space-6);
    }
    .loto-table {
      min-width: 600px;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }
    .loto-row {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .loto-row:hover {
      background-color: rgba(99, 102, 241, 0.05);
      transform: translateY(-1px);
    }
    .cf-badge {
      display: inline-block;
      padding: 0.35em 0.65em;
      font-size: 20px;
      font-weight: 700;
      line-height: 1;
      color: #8e0000;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: 0.25rem;
    }
    .cf-text-sm {
      font-size: 17px;
    }
    .cf-text-muted {
      color: #000 !important;
    }
    /* Additional mobile-specific optimizations */
    @media (max-width: 768px) {
      /* Ensure proper scrolling on mobile */
      .table-wrapper {
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
      }
      
      /* Mobile-specific button groups */
      .btn-group-mobile {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .btn-group-mobile .btn {
        width: 100%;
        justify-content: center;
      }
      
      /* Mobile navigation improvements */
      .navbar-collapse {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 0.5rem;
        margin-top: 0.5rem;
        padding: 1rem;
        box-shadow: var(--shadow-lg);
      }
      
      /* Mobile form improvements */
      .form-row-mobile {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      /* Mobile table improvements */
      .table-mobile-card {
        display: block;
        background: white;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--gray-200);
      }
      
      .table-mobile-card .table-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--gray-100);
      }
      
      .table-mobile-card .table-row:last-child {
        border-bottom: none;
      }
      
      .table-mobile-card .table-label {
        font-weight: 600;
        color: var(--gray-600);
        font-size: 0.875rem;
      }
      
      .table-mobile-card .table-value {
        color: var(--gray-900);
        font-size: 0.875rem;
      }
    }

    /* Rejection Information Styling */
    .rejection-group {
      border-left: 4px solid #ef4444;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    }
    
    .rejection-details {
      margin-top: 1rem;
    }
    
    .rejection-info {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .rejection-field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .rejection-field label {
      font-weight: 600;
      color: #991b1b;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .rejection-field span {
      color: #7f1d1d;
      font-size: 0.9rem;
    }
    
    .rejection-notes {
      background: white;
      border: 1px solid #fecaca;
      border-radius: 0.5rem;
      padding: 1rem;
      color: #7f1d1d;
      font-size: 0.9rem;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .rejected-fields-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .rejected-field-badge {
      background: #fee2e2;
      color: #991b1b;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.8rem;
      font-weight: 500;
      border: 1px solid #fecaca;
    }
    
    @media (min-width: 768px) {
      .rejection-info {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Rejection Modal Styling */
    .rejection-modal {
      max-width: 600px;
      width: 90%;
    }

    .rejection-info {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .rejection-info p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
    }

    .field-help-text {
      font-size: 0.875rem;
      color: #6c757d;
      margin-bottom: 1rem;
    }

    .field-selection-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
      padding: 1rem;
      background: #f8f9fa;
    }

    .field-checkbox-item {
      display: flex;
      align-items: center;
    }

    .field-checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.9rem;
      margin: 0;
      padding: 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease;
    }

    .field-checkbox-label:hover {
      background: #e9ecef;
    }

    .field-checkbox {
      margin-right: 0.75rem;
      transform: scale(1.1);
    }

    .field-checkbox-text {
      font-weight: 500;
      color: #495057;
    }

    .field-checkbox:checked + .field-checkbox-text {
      color: #dc3545;
      font-weight: 600;
    }

    @media (min-width: 768px) {
      .field-selection-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* Modal Base Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 1rem;
    }

    .modal-container {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.375rem;
      color: #6b7280;
      transition: all 0.2s ease;
    }

    .modal-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .required {
      color: #dc2626;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }

    /* Status Change Modal Styles */
    .status-change-modal {
      max-width: 600px;
    }

    .status-info {
      background: #f8f9fa;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .status-info p {
      margin-bottom: 0.5rem;
    }

    .status-info p:last-child {
      margin-bottom: 0;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      margin-left: 0.5rem;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-completed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-pending_handover {
      background: #e0e7ff;
      color: #3730a3;
    }

    .status-rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Handover Modal Styles */
    .handover-modal {
      max-width: 600px;
    }

    .handover-info {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .handover-info p {
      margin: 0.5rem 0;
      font-size: 0.9rem;
    }

    /* Handover History Styles */
    .handover-history-section {
      background: #ffffff;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem 0;
    }

    .handover-history-content {
      margin-top: 1rem;
    }

    .handover-chain {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .handover-chain h6 {
      color: #495057;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .chain-display {
      font-size: 1.1rem;
      font-weight: 600;
      color: #007bff;
      padding: 0.5rem;
      background: white;
      border-radius: 6px;
      border: 1px solid #dee2e6;
    }

    .current-responsible {
      background: #e7f3ff;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border-left: 4px solid #007bff;
    }

    .current-responsible h6 {
      color: #0056b3;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .responsible-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #0056b3;
    }

    .detailed-history h6 {
      color: #495057;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .history-item {
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
      transition: all 0.2s ease;
    }

    .history-item:hover {
      border-color: #007bff;
      box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
    }

    .history-main {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .from-user, .to-user {
      font-weight: 600;
      color: #495057;
    }

    .arrow {
      color: #007bff;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .history-details {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .history-details span {
      font-size: 0.8rem;
      color: #6c757d;
      background: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .handover-notes {
      background: #f8f9fa;
      padding: 0.75rem;
      border-radius: 6px;
      border-left: 3px solid #007bff;
      font-size: 0.9rem;
      color: #495057;
    }

    .no-history {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
    }

    .no-history p {
      margin-bottom: 1rem;
    }

    /* Verification Styles */
    .verification-section {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .verification-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .verification-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .verification-badge.pending {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    .verification-badge.approved {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .verification-badge.rejected {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .verification-details {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #495057;
    }

    .verified-by {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .verification-notes,
    .rejection-reason {
      background: #ffffff;
      padding: 0.75rem;
      border-radius: 6px;
      border-left: 3px solid #007bff;
      margin-top: 0.5rem;
      font-size: 0.85rem;
    }

    .rejection-reason {
      border-left-color: #dc3545;
    }

    .verification-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .verification-actions .btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    .assigned-verifier {
      margin-top: 0.75rem;
      padding: 0.75rem;
      background: #e3f2fd;
      border-radius: 6px;
      border-left: 3px solid #2196f3;
      font-size: 0.9rem;
      color: #1565c0;
    }

    .assigned-verifier strong {
      color: #0d47a1;
    }

    /* Recipient Decision Styles */
    .recipient-decision-section {
      margin-top: 1rem;
      padding: 1rem;
      background: #f0f8ff;
      border-radius: 8px;
      border: 1px solid #b3d9ff;
    }

    .recipient-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .recipient-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .recipient-badge.pending {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    .recipient-badge.accepted {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .recipient-badge.rejected {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .recipient-details {
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #495057;
    }

    .recipient-decision-info {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .recipient-decision-notes {
      background: #ffffff;
      padding: 0.75rem;
      border-radius: 6px;
      border-left: 3px solid #007bff;
      margin-top: 0.5rem;
      font-size: 0.85rem;
    }

    .recipient-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .recipient-actions .btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    .loading-text {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
      font-style: italic;
    }

    /* Responsive Design for Handover History */
    @media (max-width: 768px) {
      .handover-history-section {
        padding: 1rem;
      }

      .chain-display {
        font-size: 1rem;
        word-break: break-all;
      }

      .history-details {
        flex-direction: column;
        gap: 0.5rem;
      }

      .history-main {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .arrow {
        transform: rotate(90deg);
      }
    }
  `}</style>
);
export default GlobalStyles;

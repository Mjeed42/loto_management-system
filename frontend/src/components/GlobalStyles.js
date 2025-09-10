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
    .container {
      width: 100%;
      padding-right: var(--space-6);
      padding-left: var(--space-6);
      margin-right: auto;
      margin-left: auto;
      position: relative;
    }
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
      padding: var(--space-2) var(--space-4);
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
      color: color: #000;
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
    .form-label {
      display: inline-flex;
      margin-bottom: var(--space-2);
      font-weight: 500;
      color: #f00;
      font-size: 0.875rem;
    }
    .form-control {
      display: block;
      width: 100%;
      padding: var(--space-3) var(--space-4);
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: color: #000;
      background: var(--white);
      border: 2px solid var(--gray-200);
      border-radius: var(--radius);
      transition: var(--transition);
      font-family: inherit;
    }
    .form-control:focus {
      color: color: #000;
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
    .table {
      width: 100%;
      margin-bottom: var(--space-6);
      color: color: #000;
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
    }
    .table thead th {
      vertical-align: bottom;
      border-bottom: 2px solid var(--gray-300);
      background: linear-gradient(
        135deg,
        var(--gray-50) 0%,
        var(--gray-100) 100%
      );
      font-weight: 600;
      color: #f00;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.875rem;
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
      min-width: 12rem;
      padding: var(--space-2);
      margin: var(--space-2) 0 0;
      font-size: 1rem;
      color: color: #000;
      text-align: left;
      list-style: none;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
    }
    .dropdown-menu.show {
      display: block;
      animation: dropdownFadeIn 0.2s ease-out;
      z-index: 2000;
    }
    header, .navbar, .dropdown, .dropdown-menu {
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
    .dropdown-item {
      display: block;
      width: 100%;
      padding: var(--space-3) var(--space-4);
      clear: both;
      font-weight: 400;
      color: #f00;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      border: 0;
      text-decoration: none;
      border-radius: var(--radius);
      transition: var(--transition);
    }
    .dropdown-item:hover {
      color: var(--primary-600);
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
      background: #bfffba;
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
    .d-inline-flex {
      display: inline-flex;
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
    /* Responsive Design */
    @media (min-width: 576px) {
      .container {
        max-width: 540px;
      }
    }
    @media (min-width: 768px) {
      .container {
        max-width: 720px;
      }
    }
    @media (min-width: 992px) {
      .container {
        max-width: 960px;
      }
    }
    @media (min-width: 1200px) {
      .container {
        max-width: 1140px;
      }
    }
    @media (min-width: 1400px) {
      .container {
        max-width: 1320px;
      }
    }
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      :root {
        --gray-50: #0f172a;
        --gray-100: #1e293b;
        --gray-200: #334155;
        --gray-300: #475569;
        --gray-400: #64748b;
        --gray-500: #94a3b8;
        --gray-600: #cbd5e1;
        --gray-700: #e2e8f0;
        --gray-800: #f1f5f9;
        --gray-900: #f8fafc;
      }
      body {
        background: linear-gradient(
          135deg,
          var(--gray-900) 0%,
          color: #000 100%
        );
        color: var(--gray-100);
      }
    }
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
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .progress {
      border-radius: 50rem;
    }
    .progress-bar {
      border-radius: 50rem;
    }
    .table-hover tbody tr:hover {
      background-color: rgba(99, 102, 241, 0.05);
      transform: scale(1.01);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
      color: #212529;
      text-align: left;
      list-style: none;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid rgba(0, 0, 0, 0.15);
      border-radius: 0.25rem;
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
      color: #212529;
      text-align: inherit;
      text-decoration: none;
      white-space: nowrap;
      background-color: transparent;
      border: 0;
    }
    .dropdown-item:hover,
    .dropdown-item:focus {
      color: #1e2125;
      background-color: #e9ecef;
    }
    .dropdown-item.active,
    .dropdown-item:active {
      color: #fff;
      text-decoration: none;
      background-color: #0d6efd;
    }
    .dropdown-item.disabled,
    .dropdown-item:disabled {
      color: #adb5bd;
      pointer-events: none;
      background-color: transparent;
    }
    .dropdown-divider {
      height: 0;
      margin: 0.5rem 0;
      overflow: hidden;
      border-top: 1px solid rgba(0, 0, 0, 0.15);
    }
    /* Cursor Pointer */
    .cursor-pointer {
      cursor: pointer;
    }
    /* Offcanvas/Sidebar Menu */
    .offcanvas {
      position: fixed;
      bottom: 0;
      z-index: 1050;
      display: flex;
      flex-direction: column;
      max-width: 100%;
      color: var(--cf-text-primary);
      background-color: var(--cf-white);
      background-clip: padding-box;
      outline: 0;
      transition: transform 0.3s ease-in-out;
    }
    .offcanvas-start {
      top: 0;
      left: 0;
      width: 280px;
      border-right: 1px solid var(--cf-border);
      transform: translateX(-100%);
    }
    .offcanvas.offcanvas-start.show {
      transform: none;
    }
    .offcanvas-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1rem;
      border-bottom: 1px solid var(--cf-border);
    }
    .offcanvas-title {
      margin-bottom: 0;
      line-height: 1.5;
    }
    .offcanvas-body {
      flex-grow: 1;
      padding: 1rem 1rem;
      overflow-y: auto;
    }
    .offcanvas-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1040;
      width: 100vw;
      height: 100vh;
      background-color: #000;
    }
    .offcanvas-backdrop.fade {
      opacity: 0;
    }
    .offcanvas-backdrop.show {
      opacity: 0.5;
    }
    /* Sidebar Navigation */
    .sidebar-heading {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .nav-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      margin: 0.125rem 0;
      color: var(--cf-text-secondary);
      text-decoration: none;
      border-radius: var(--cf-radius);
      transition: var(--cf-transition);
    }
    .nav-link:hover {
      color: var(--cf-text-primary);
      background-color: var(--cf-gray-100);
    }
    .nav-link.active {
      color: var(--cf-primary);
      background-color: var(--cf-primary-50);
      font-weight: 500;
    }
    /* Close button */
    .btn-close {
      box-sizing: content-box;
      width: 1em;
      height: 1em;
      padding: 0.25em 0.25em;
      color: #000;
      background: transparent url("image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
      border: 0;
      border-radius: 0.375rem;
      opacity: 0.5;
    }
    .btn-close:hover {
      color: #000;
      text-decoration: none;
      opacity: 0.75;
    }
    .btn-close:focus {
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
      opacity: 1;
    }
    .btn-close:disabled,
    .btn-close.disabled {
      pointer-events: none;
      user-select: none;
      opacity: 0.25;
    }
    /* Divider */
    hr.my-3 {
      margin-top: 1rem;
      margin-bottom: 1rem;
      border: 0;
      border-top: 1px solid var(--cf-border);
    }
    hr.dropdown-divider {
      height: 0;
      margin: 0.5rem 0;
      overflow: hidden;
      border-top: 1px solid var(--cf-border);
    }

    /* ============ DASHBOARD STYLES ============ */
    /* Dashboard Styles */
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
      background-color: #f8fafc;
      min-height: 100vh;
    }

    .dashboard-header {
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
      gap: 0.5rem;
    }

    .header-logo h1 {
      font-size: 2rem;
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

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border: 1px solid #e5e7eb;
      cursor: pointer;
    }

    .dashboard-card:hover {
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
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-header {
        padding: 1.5rem;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-time {
        margin-top: 0.5rem;
      }

      .dashboard-cards {
        gap: 1.5rem;
      }

      .dashboard-card {
        padding: 1.5rem;
      }
    }

    /* ============ ADMIN DASHBOARD STYLES ============ */
    /* Statistics Cards */
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

    .status-pill:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Empty State */
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

    /* Form Styles */
    .form-label {
      font-weight: 500;
      color: #1f2937;
      margin-bottom: 0.5rem;
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

    /* LOTO Table */
    .loto-table {
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

    /* Responsive adjustments for Admin Dashboard */
    @media (max-width: 768px) {
      .stats-card {
        padding: 1rem;
      }

      .stats-icon-wrapper {
        width: 50px;
        height: 50px;
        font-size: 1.25rem;
      }

      .stats-number {
        font-size: 1.25rem;
      }

      .empty-state {
        padding: 2rem 1rem;
      }

      .empty-state-icon {
        font-size: 2.5rem;
      }

      .empty-state-title {
        font-size: 1.25rem;
      }
    }
  `}</style>
);

export default GlobalStyles;

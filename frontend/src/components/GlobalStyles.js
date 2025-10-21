import React from "react";
const GlobalStyles = () => (
  <style>{`
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");
    
    /* Force light theme only - no dark mode support */
    * {
      color-scheme: light only;
    }
    
    /* App Loading Screen */
    .app-loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    .loading-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .loading-logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
      animation: pulse 2s infinite;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .loading-content p {
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      margin: 0;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    /* Global Loading Overlay */
    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(248, 250, 252, 0.95);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    
    .global-loading-overlay .loading-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .global-loading-overlay .loading-logo {
      width: 60px;
      height: 60px;
      object-fit: contain;
      animation: pulse 2s infinite;
    }
    
    .global-loading-overlay .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top: 3px solid #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .global-loading-overlay .loading-content p {
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      margin: 0;
    }
    
    html {
      color-scheme: light;
    }
    
    :root {
      /* Light Theme Color Palette - Optimized for professional use */
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
        --green-400: #4ade80; /* Tailwind green-400 */
  --green-500: #22c55e; /* Tailwind green-500 */
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
    /* Reset and base styles - Compatible with Tailwind */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
    
    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    
    /* Body styles that work with Tailwind */
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.6;
      color: var(--gray-900);
      background-color: var(--gray-50);
      overflow-x: hidden;
    }
    
    /* Ensure Tailwind utilities work properly */
    .tailwind-compatible {
      all: unset;
    }
    
    /* Login page uses inline styles - no conflicting CSS needed */
    
    /* Ensure gradients work properly */
    .bg-gradient-to-br {
      background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
    }
    
    /* Custom blue gradients for PepsiCo branding */
    .from-blue-900 {
      --tw-gradient-from: #1e3a8a;
      --tw-gradient-to: rgba(30, 58, 138, 0);
      --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    }
    
    .via-blue-800 {
      --tw-gradient-to: rgba(30, 40, 175, 0);
      --tw-gradient-stops: var(--tw-gradient-from), #1e40af, var(--tw-gradient-to);
    }
    
    .to-blue-600 {
      --tw-gradient-to: #2563eb;
    }
    
    /* Ensure proper font loading */
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 300 800;
      font-display: swap;
      src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
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

    /* Specific styling for submit buttons */
    .submit-btn {
      background: var(--gradient-primary) !important;
      color: var(--white) !important;
      border: none !important;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
      font-weight: 600 !important;
      font-size: 1.1rem !important;
      padding: 1rem 2rem !important;
      border-radius: 12px !important;
      transition: all 0.2s ease !important;
    }

    .submit-btn:hover {
      background: var(--primary-700) !important;
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4) !important;
      transform: translateY(-2px) scale(1.02) !important;
    }

    .submit-btn:disabled {
      background: var(--gray-400) !important;
      color: var(--gray-600) !important;
      box-shadow: none !important;
      transform: none !important;
      cursor: not-allowed !important;
    }
    .btn-secondary {
      color: var(--gray-700);
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
        rgba(251, 251, 255, 0.05) 0%,
        rgba(247, 244, 255, 0.05) 100%
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
      background: var(--success-600);
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
        background: rgba(255, 255, 255, 0.23);
        border-color: rgba(255, 255, 255, 0.1);
        color: var(--black);
      }
      
      .card-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(139, 92, 246, 0.1) 100%);
        border-bottom-color: rgba(255, 255, 255, 0.1);
        color: var(--black);
      }
      
      .card-footer {
        background: var(--gray-100);
        border-top-color: rgba(255, 255, 255, 0.1);
      }
      
      /* Table styling */
      .table-light {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: var(--shadow);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  overflow: hidden;
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
        background: rgba(88, 88, 88, 0.33);
        border-color: var(--gray-300);
        color: var(--black);
      }
      
      .form-control:focus {
        border-color: var(--primary-500);
        background: rgba(255, 255, 255, 0.95);
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
        background: rgba(255, 255, 255, 0.95);
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
        background: rgba(255, 255, 255, 0.95);
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
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .Home-card:hover {
        border-color: var(--primary-500);
      }
      
      /* Admin page specific dark mode */
      .stats-card {
        background: rgba(255, 255, 255, 0.95);
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
        background: rgba(177, 233, 10, 0.07);
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
      background: var(--success-600);
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
      gap: 0.5rem;
      flex-shrink: 0;
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
      margin-left: -2px;
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
      background: rgba(30, 34, 255, 0.1);
      color:rgb(255, 28, 28);
    }
    
    .dropdown-item.logout-item {
      color:rgb(193, 10, 10);
    }
    
    .dropdown-item.logout-item:hover {
      background: rgb(186, 0, 0);
      color: #dc2626;
    }
    
    /* ============ PepsiCo Logo Styles ============ */
    
   .login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 0.5rem;
  padding: 2rem 1rem;
}

.login-card {
  position: relative;
  width: 500px;
  max-width: 90%;
  padding: 2.5rem 2.5rem;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
  text-align: center;
  color: #333;
  transition: all 0.3s ease;
  /* Keep logo and title in same position regardless of RTL/LTR */
  direction: ltr;
}

.login-page .footer-container {
  width: 500px;
  max-width: 90%;
  background-color: #1f2937;
  color: #f9fafb;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
  border-top: none;
  margin-top: auto;
  padding: 1.5rem;
}

/* Logo */
.login-card .logo {
  width: 120px;
  margin-bottom: 1rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Subtitle */
.login-card .subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0033a0; /* Pepsi blue */
  margin-bottom: 1.5rem;
  text-align: center;
  direction: ltr; /* Keep title LTR even in RTL mode */
}

/* Form styling */
.login-card .form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-card label {
  text-align: left;
  font-size: 0.9rem;
  color: #0033a0;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.login-card input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-card input:focus {
  border-color: #0033a0;
  box-shadow: 0 0 6px rgba(0, 51, 160, 0.3);
  outline: none;
}

/* Button */
.login-card button {
  background-color: #0033a0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.login-card button:hover {
  background-color: #002070;
  transform: translateY(-2px);
}

.login-card button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Error box */
.login-card .error-box {
  background: #ffe6e6;
  color: #d00000;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

/* Language Toggle */
.language-toggle-container {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.language-toggle-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.language-toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.language-toggle-button:hover {
  background: rgba(243, 244, 246, 1);
  border-color: #0033a0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 51, 160, 0.1);
}

.language-option {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #6b7280;
}

.language-option.active {
  background: linear-gradient(135deg, #0033a0 0%, #002070 100%);
  color: white;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  box-shadow: 0 2px 6px rgba(0, 51, 160, 0.3);
}

.language-divider {
  color: #d1d5db;
  font-weight: 300;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
    gap: 0.5rem;
  }

  .login-card {
    width: 85%;
    max-width: 500px;
    padding: 1.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .login-card .logo {
    width: 100px;
  }

  .login-card .subtitle {
    font-size: 1.1rem;
  }
}

    
    /* Header Hamburger Button */
    .header-hamburger-btn {
      display: none; /* Hidden by default */
      width: 40px;
      height: 40px;
      background: #0969da;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      flex-shrink: 0; /* Prevent shrinking */
    }

    .header-hamburger-btn:hover {
      background: #0860ca;
      transform: scale(1.05);
    }

    .header-hamburger-btn svg {
      width: 20px;
      height: 20px;
    }

    /* Responsive header styles */
    @media (max-width: 768px) {
      .header-container {
        padding: 0.75rem 1rem; /* Restore normal padding */
        justify-content: flex-start; /* Start from left */
        align-items: center;
        gap: 0; /* No gap between elements */
      }
      
      /* Show hamburger button on mobile */
      .header-hamburger-btn {
        display: flex !important;
        margin: 0; /* Remove all margins */
        position: relative;
        left: -1rem; /* Pull button to the very left edge */
      }
      
      /* Adjust page title to take remaining space */
      .page-title {
        flex: 1;
        margin-left: 16px; /* Add space from hamburger button */
      }
      
      /* Ensure header actions stay on the right */
      .header-actions {
        margin-left: auto; /* Push to the right */
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
        margin-left: -2px;
      }
      
      .modern-dropdown {
        min-width: 200px;
      }
    }
    
    /* Responsive logo sizing */
    /* Removed conflicting login-page-container media queries */
    
      
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
        background: rgba(195, 218, 255, 0.8)
      }
      
      .user-btn:hover {
        background: rgba(99, 102, 241, 0.2);
      }
      
      .user-name {
        color: #f9fafb;
      }
      
      .user-role {
        color: #9ca3af;
      }
      
     
      
      .dropdown-item {
        color: #000;
      }
      
      .dropdown-item:hover {
        background: rgba(80, 243, 255, 0.2);
        color:rgb(0, 42, 255);
      }
      
      /* Removed conflicting login-page-container dark mode styles */
      
      
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
  background: ##b5b5b53d;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
      
    }
    
    .stat-card.active .stat-number {
      color: #6366f1;
      font-weight: 700;
    }
    
    .stat-card.active .stat-label {
      color:rgb(0, 4, 255);
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
    
      
      .stat-number {
        background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%);
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
      
      
      
      .stat-card.active .stat-number {
        color: #818cf8;
      }
      
      .stat-card.active .stat-label {
        color:rgb(0, 28, 168);
      }
    }

    /* ============ Modern Create LOTO Styles ============ */
    
    .create-loto-container {
      max-width: 100%;
      margin: 0 auto;
      padding: 2rem;
    }
    
    /* Mobile-First Header Styles */
    .create-loto-mobile-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .mobile-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .mobile-header-content h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #333;
      margin: 0;
    }

    .mobile-progress-indicator {
      text-align: center;
    }

    .progress-dots {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .progress-dot {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e5e7eb;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .progress-dot.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .progress-dot.completed {
      background: #10b981;
      color: white;
      border-color: #10b981;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
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
      background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .brand-text p {
      font-size: 0.875rem;
      color: rgb(138, 138, 138);
      margin: 0;
    }
    
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      
      border: none;
      border-radius: 0.875rem;
      font-weight: 600;
      font-size: 0.79rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      position: relative;
      overflow: hidden;
      min-height: 48px;
      width: 170px;
    }
    
    .action-btn.primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
    }
    
    .action-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.35);
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    }
    
    .action-btn.primary:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }
    
    .action-btn.secondary {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      color: #475569;
      border: 1px solid #cbd5e1;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .action-btn.secondary:hover {
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
      color: #334155;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: #94a3b8;
    }
    
    .action-btn.secondary:active {
      transform: translateY(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .btn-icon {
      width: 30px;
      height: 20px;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }
    
    .action-btn:hover .btn-icon {
      transform: scale(1.1);
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
    
      
      .brand-text h1 {
        background: linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .brand-text p {
        color: rgb(138, 138, 138);
      }
      
      .modern-form-container {
        background: rgba(255, 255, 255, 0.95);
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
      background: rgba(255, 255, 255, 0.28);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
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
    

    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .info-group {
      background: rgb(255, 255, 255);
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .group-title {
      font-size: 1.125rem;
      font-weight: 600;
      color:rgb(0, 0, 0);
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
  background: white;
  border-radius: 20px;
}
    
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin:  0 1rem 0;
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
      background: rgb(255, 255, 255);
      border-color: rgba(16, 185, 129, 0.2);
    }
    
    .info-section.handover-section {
      background: rgba(6, 181, 212, 0.6);
      border-color: rgba(6, 182, 212, 0.2);
    }
    
    .info-section.completion-section {
      background: rgba(16, 185, 129, 0.05);
      border-color: rgba(16, 185, 129, 0.2);
    }
    
    .info-section.finish-section {
      background: rgba(157, 234, 122, 0.5);
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
      background: rgba(6, 181, 212, 0.44);
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
      background: rgba(6, 181, 212, 0.83);
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
      .action-group.admin-group {
      background: rgba(145, 3, 17, 0.13);
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
      color: #004d99;
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
    
      
      .info-title h3,
      .actions-title h3 {
        color: black;
      }
      
      .info-title p,
      .actions-title p {
        color: #9ca3af;
      }
      
      
      .info-label {
        color: #9ca3af;
      }
      
      .info-value {
        color: #f9fafb;
      }
      
      .info-group,
      .status-info-section {
        background: rgb(255, 255, 255);
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
        color: #004d99;
      }
      
      .action-header p {
        color: #9ca3af;
      }
      
      .status-header h5 {
        color: #000;
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
      color: black;
      margin: 0 0 1rem 0;
    }
    
    .access-denied p {
      font-size: 1.125rem;
      color: black;
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
      background: rgb(255, 255, 255);
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .group-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #000;
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
    
      
      .access-denied h2 {
        color: black;
      }
      
      .access-denied p {
        color: black;
      }
      
     
      
      .option-group {
        background: rgb(255, 255, 255);
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
        color: #000;
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
      color: #f00;
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
      color: #8985fb;
    }
    
    .status-indicator {
      width: 8px;
      height: 8px;
      
      
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
      color: #fff;
      margin-bottom: 0.5rem;
    }
    
    .performance-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }
    
    /* New Employee Performance Monitoring Styles */
    .chart-card.full-width {
      grid-column: 1 / -1;
    }
    
    .performance-card.full-width {
      grid-column: 1 / -1;
    }
    
    .employee-performance-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .section-header {
      margin-bottom: 1.5rem;
    }
    
    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .section-header p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .performance-table-container {
      overflow-x: auto;
      border-radius: 0.75rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
    }
    
    .performance-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    
    .performance-table thead {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
    }
    
    .performance-table thead th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    
    .performance-table tbody tr {
      border-bottom: 1px solid rgba(229, 231, 235, 0.5);
      transition: background-color 0.2s ease;
    }
    
    .performance-table tbody tr:hover {
      background-color: rgba(99, 102, 241, 0.05);
    }
    
    .performance-table tbody tr.top-performer {
      background-color: rgba(255, 215, 0, 0.08);
    }
    
    .performance-table tbody tr.top-performer:hover {
      background-color: rgba(255, 215, 0, 0.15);
    }
    
    .performance-table td {
      padding: 1rem;
      color: #374151;
    }
    
    .rank-cell {
      font-size: 1.2rem;
      font-weight: 700;
      text-align: center;
      width: 60px;
    }
    
    .name-cell {
      font-weight: 600;
      color: #1f2937;
      min-width: 150px;
    }
    
    .email-cell {
      color: #6b7280;
      font-size: 0.8rem;
      min-width: 180px;
    }
    
    .role-cell {
      min-width: 100px;
    }
    
    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    
    .role-badge.admin {
      background-color: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }
    
    .role-badge.technician {
      background-color: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }
    
    .role-badge.engineer {
      background-color: rgba(16, 185, 129, 0.1);
      color: #059669;
    }
    
    .number-cell {
      text-align: center;
      font-weight: 600;
      min-width: 70px;
    }
    
    .number-cell.success {
      color: #059669;
    }
    
    .number-cell.warning {
      color: #f59e0b;
    }
    
    .number-cell.pending {
      color: #ef4444;
    }
    
    .number-cell.verified {
      color: #6366f1;
    }
    
    .percentage-cell {
      min-width: 150px;
      padding: 0.5rem 1rem;
    }
    
    .percentage-bar-container {
      position: relative;
      height: 32px;
      background-color: rgba(229, 231, 235, 0.5);
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .percentage-bar {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      transition: width 0.3s ease;
      border-radius: 0.5rem;
    }
    
    .percentage-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: 700;
      font-size: 0.75rem;
      color: #1f2937;
    }
    
    .no-data-cell {
      text-align: center;
      padding: 3rem;
      color: #9ca3af;
      font-style: italic;
    }
    
    .performance-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .performance-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }
    
    .performance-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .performance-description {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.25rem;
    }
    
    .metric-card.compliance-card::before {
      background: linear-gradient(90deg, #10b981, #059669);
    }
    
    .metric-card.efficiency-card::before {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }
    
    .metric-card.performance-card::before {
      background: linear-gradient(90deg, #8b5cf6, #7c3aed);
    }
    
    /* Database Export Styles */
    .collections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    
    .collection-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(229, 231, 235, 0.8);
      border-radius: 1rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .collection-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      border-color: rgba(99, 102, 241, 0.5);
    }
    
    .collection-card.selected {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
      border-color: #6366f1;
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
    }
    
    .collection-checkbox {
      flex-shrink: 0;
      margin-top: 0.25rem;
    }
    
    .collection-checkbox input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: #6366f1;
    }
    
    .collection-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }
    
    .collection-info {
      flex: 1;
    }
    
    .collection-info h4 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .collection-info p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }
    
    .collection-card.user-specific {
      opacity: 0.85;
      border-style: dashed;
    }
    
    .user-specific-badge {
      display: inline-block;
      margin-left: 0.5rem;
      padding: 0.125rem 0.5rem;
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .quick-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .quick-action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
    }
    
    .quick-action-btn.secondary {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    }
    
    .quick-action-btn.secondary:hover {
      box-shadow: 0 8px 16px rgba(107, 114, 128, 0.3);
    }
    
    .quick-action-btn .btn-icon {
      width: 18px;
      height: 18px;
    }
    
    .info-section {
      margin-top: 2rem;
    }
    
    .info-card {
      background: rgba(59, 130, 246, 0.05);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
    }
    
    .info-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }
    
    .info-content h4 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }
    
    .info-content ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .info-content ul li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
      color: #4b5563;
      font-size: 0.875rem;
      line-height: 1.6;
    }
    
    .info-content ul li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: 700;
    }
    
    /* Stats Cards Grid */
    .stats-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .stat-detail-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .stat-card-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(229, 231, 235, 0.5);
    }
    
    .stat-card-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }
    
    .stat-card-header p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    
    .stat-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .stat-item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 0.75rem;
      border: 1px solid rgba(229, 231, 235, 0.5);
      transition: all 0.3s ease;
    }
    
    .stat-item-row:hover {
      background: rgba(243, 244, 246, 1);
      transform: translateX(4px);
    }
    
    .stat-item-icon {
      font-size: 2rem;
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.75rem;
    }
    
    .stat-item-icon.rejection {
      background: rgba(239, 68, 68, 0.1);
    }
    
    .stat-item-icon.warning {
      background: rgba(245, 158, 11, 0.1);
    }
    
    .stat-item-icon.info {
      background: rgba(99, 102, 241, 0.1);
    }
    
    .stat-item-icon.handover {
      background: rgba(139, 92, 246, 0.1);
    }
    
    .stat-item-icon.pending {
      background: rgba(245, 158, 11, 0.1);
    }
    
    .stat-item-icon.success {
      background: rgba(16, 185, 129, 0.1);
    }
    
    .stat-item-content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .stat-item-label {
      font-weight: 500;
      color: #374151;
      font-size: 0.95rem;
    }
    
    .stat-item-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }
    
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
      .performance-card,
      .employee-performance-section {
        padding: 1rem;
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
      
      .performance-metrics,
      .performance-metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .metric-number {
        font-size: 2rem;
      }
      
      .chart-container {
        height: 250px;
      }
      
      .performance-table-container {
        font-size: 0.75rem;
      }
      
      .performance-table thead th,
      .performance-table td {
        padding: 0.5rem;
        font-size: 0.7rem;
      }
      
      .rank-cell {
        font-size: 1rem;
        width: 40px;
      }
      
      .percentage-bar-container {
        height: 24px;
      }
      
      .percentage-text {
        font-size: 0.65rem;
      }
      
      .stats-cards-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .stat-detail-card {
        padding: 1rem;
      }
      
      .stat-item-icon {
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
      }
      
      .stat-item-value {
        font-size: 1.25rem;
      }
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
     
        .loading-state h3, .chart-header h3, .card-header h3, .metric-label, .alert-title, .health-label, .performance-value, .update-time
        {
        color: #000;
        }
      .alert-item, .health-item, .performance-item
      {
      background:white;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }
 
      .metric-number {
        
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .alert-item,
      .health-item,
      .performance-item {
        background: white;
        border-color: rgba(75, 85, 99, 0.5);
      }
      
      .alert-count,
      .health-value {
        color: color: rgb(138, 138, 138);
      }
    }

    /* ============ MODERN HOME PAGE STYLES ============ */
    
    .home-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    @media (min-width: 768px) {
      .home-container {
        padding: 2rem 2rem;
      }
    }
    
    @media (min-width: 1200px) {
      .home-container {
        padding: 3rem 2rem;
      }
    }

    /* Hero Section */
    .home-hero {
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--white) 50%, var(--gray-50) 100%);
      border-radius: 24px;
      padding: 3rem 2rem;
      margin-bottom: 3rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-200);
      position: relative;
      overflow: hidden;
    }

    .home-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600), var(--primary-500));
      opacity: 0.8;
    }

    .hero-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 3rem;
      position: relative;
      z-index: 1;
    }

    .hero-text {
      flex: 1;
      max-width: 600px;
    }

    .greeting-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .greeting-icon {
      font-size: 2.5rem;
      animation: pulse 2s infinite;
    }

    .greeting-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.125rem;
      color: var(--gray-600);
      line-height: 1.6;
      margin-bottom: 2rem;
      font-weight: 500;
    }

    .hero-time {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .time-display {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--white);
      padding: 1rem 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--gray-200);
    }

    .time-icon {
      font-size: 1.5rem;
      color: var(--primary-600);
    }

    .time-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .current-time {
      font-weight: 700;
      font-size: 1.5rem;
      color: var(--gray-900);
    }

    .current-date {
      font-size: 0.875rem;
      color: var(--gray-600);
      font-weight: 500;
    }

    .hero-visual {
      flex-shrink: 0;
    }

    .hero-icon {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
      animation: float 3s ease-in-out infinite;
    }

    .main-icon {
      font-size: 4rem;
      color: var(--white);
    }

    /* Main Content Grid */
    .home-main-grid {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    /* Stats Card */
    .home-stats-card {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-200);
      grid-column: 1;
      grid-row: 1;
    }

    .stats-header {
      margin-bottom: 2rem;
    }

    .stats-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
    }

    .stats-header p {
      font-size: 0.875rem;
      color: var(--gray-600);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .stat-card {
  background: #1a1a1a3d;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--primary-500);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .stat-card:hover::before {
      opacity: 1;
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .stat-card.total .stat-icon {
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    }

    .stat-card.active .stat-icon {
      background: linear-gradient(135deg, var(--success-100), var(--success-200));
    }

    .stat-card.pending .stat-icon {
      background: linear-gradient(135deg, var(--warning-100), var(--warning-200));
    }

    .stat-card.completed .stat-icon {
      background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--gray-900);
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 1rem;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 0.25rem;
    }

    .stat-description {
      font-size: 0.875rem;
      color: var(--gray-600);
      line-height: 1.4;
    }

    /* Actions Card */
    .home-actions-card {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-200);
      grid-column: 1;
      grid-row: 2;
    }

    .actions-header {
      margin-bottom: 2rem;
    }

    .actions-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
    }

    .actions-header p {
      font-size: 0.875rem;
      color: var(--gray-600);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    /* Role Card */
    .home-role-card {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-200);
      grid-column: 2;
      grid-row: 1;
    }

    .role-header {
      margin-bottom: 1.5rem;
    }

    .role-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 0.5rem;
    }

    .role-header p {
      font-size: 0.875rem;
      color: var(--gray-600);
    }

    .role-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .role-badge {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--gray-50);
      border-radius: 12px;
      border: 1px solid var(--gray-200);
    }

    .role-icon {
      font-size: 2rem;
    }

    .role-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .role-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--gray-900);
    }

    .role-description {
      font-size: 0.875rem;
      color: var(--gray-600);
    }

    .role-features h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 0.75rem;
    }

    .role-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .role-features li {
      font-size: 0.875rem;
      color: var(--gray-700);
      padding: 0.25rem 0;
    }

    /* Recent Activity Card */
    .home-recent-card {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-200);
      grid-column: 1;
      grid-row: 3;
    }

    .recent-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .recent-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0;
    }

    .view-all-btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      border-radius: 6px;
    }

    .action-card {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      max-width: 500px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-200);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .action-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }

    .action-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--primary-100);
      color: var(--primary-700);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid var(--primary-200);
    }

    .action-icon {
      width: 70px;
      height: 70px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: var(--white);
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .action-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--gray-900);
    }

    .action-content p {
      font-size: 0.875rem;
      color: var(--gray-600);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .action-button {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .action-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    /* Recent Activity Section */
    .home-recent {
      margin-bottom: 2rem;
    }

    .recent-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .recent-header h2 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0;
    }

    .view-all-btn {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      border-radius: 8px;
    }

    .recent-content {
      background: var(--white);
      border-radius: 20px;
      padding: 3rem 2rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-200);
      text-align: center;
    }

    .recent-placeholder {
      max-width: 500px;
      margin: 0 auto;
    }

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.7;
    }

    .recent-placeholder h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--gray-900);
      margin-bottom: 1rem;
    }

    .recent-placeholder p {
      font-size: 1rem;
      color: var(--gray-600);
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .cta-button {
      padding: 0.75rem 2rem;
      font-size: 1rem;
      border-radius: 12px;
    }

    /* Animations */
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .home-container {
        padding: 1rem;
      }

      .home-hero {
        padding: 2rem 1.5rem;
        margin-bottom: 2rem;
      }

      .hero-content {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
      }

      .greeting-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .hero-icon {
        width: 100px;
        height: 100px;
      }

      .main-icon {
        font-size: 3rem;
      }

      .home-main-grid {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        gap: 1.5rem;
      }

      .home-stats-card {
        grid-column: 1;
        grid-row: 1;
      }

      .home-actions-card {
        grid-column: 1;
        grid-row: 2;
      }

      .home-recent-card {
        grid-column: 1;
        grid-row: 3;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .actions-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .action-card {
        padding: 1.5rem;
      }

      .home-stats-card,
      .home-actions-card,
      .home-recent-card {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .home-hero {
        padding: 1.5rem 1rem;
      }

      .greeting-title {
        font-size: 1.75rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 0.875rem;
      }

      .action-card {
        padding: 1.25rem;
      }

      .home-stats-card,
      .home-actions-card,
      .home-recent-card {
        padding: 1rem;
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
      background: #dcfce7;
      color: #166534;
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

    /* Handover Recipient Group Styles */
    .handover-recipient-group {
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      border: 2px solid #2196f3;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    .handover-recipient-group .action-header {
      background: rgba(33, 150, 243, 0.1);
      border-radius: 10px 10px 0 0;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(33, 150, 243, 0.2);
    }

    .handover-recipient-group .action-header h5 {
      color: #004d99;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .handover-details {
      background: #ffffff;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      border-left: 4px solid #2196f3;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .handover-details strong {
      color: #1565c0;
      font-weight: 600;
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

    /* ===== SIDEBAR LAYOUT STYLES ===== */
    
    /* App Layout */
    .app-layout {
      display: flex;
      flex-direction: column; /* Stack main area and footer vertically */
      min-height: 100vh; /* Ensure full viewport height */
      background: var(--gray-50);
    }

    /* Main Area (Sidebar + Content) */
    .main-area {
      display: flex; /* Sidebar and content side by side */
      flex: 1; /* Take remaining space */
      min-height: 0; /* Allow flex shrinking */
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0; /* Prevents flex item from overflowing */
      overflow-x: auto;
    }

    /* No Sidebar Layout (Login Page) */
    .app-layout.no-sidebar {
      display: block; /* Use block layout when no sidebar */
    }

    .app-layout.no-sidebar .main-content {
      margin-left: 0;
    }

    .login-content {
      
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: 
        linear-gradient(90deg,rgba(12, 0, 157, 0.8) 0%, rgba(0, 0, 0, 0.53) 44%, rgba(32, 40, 157, 0.68) 100%), url('/pepsicoLogo.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }

    .content-area {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      
    }

    /* Header Styles */
    .modern-header {
      background: var(--white);
      border-bottom: 1px solid var(--gray-200);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      z-index: 100;
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 70px;
    }

    .page-title {
      flex: 1;
    }

    .page-title h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--gray-800);
    }

    /* Sidebar Styles */
    .sidebar {
      width: 280px;
      min-width: 280px; /* Prevents sidebar from shrinking */
      min-height: 100vh; /* Adjustable height to match content */
      background: var(--white);
      border-right: 1px solid var(--gray-200);
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      z-index: 1000;
      position: relative;
    }

    .sidebar.collapsed {
      width: 80px;
      min-width: 80px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--gray-200);
      min-height: 70px;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sidebar-logo {
      width: 60px;
      height: 35px;
      border-radius: 8px;
      margin-left: -10px;
    }

    .brand-text h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--gray-800);
    }

    .brand-text span {
      font-size: 0.8rem;
      color: var(--gray-500);
    }

    .sidebar-toggle {
      width: 32px;
      height: 32px;
      border: none;
      background: var(--gray-100);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--gray-600);
      transition: all 0.2s ease;
    }

    .sidebar-toggle:hover {
      background: var(--gray-200);
      color: var(--gray-800);
    }

    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-bottom: 1px solid var(--gray-200);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: var(--primary-100);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-600);
      flex-shrink: 0;
      margin-left: -2px;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      display: block;
      font-weight: 600;
      color: var(--gray-800);
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      display: block;
      font-size: 0.8rem;
      color: var(--gray-500);
      text-transform: capitalize;
    }

    /* Sidebar Navigation */
    .sidebar-nav {
      
      padding: 1rem 0;
      overflow-y: auto;
      margin-left: -8px;
    }

    .nav-divider {
      margin: 1rem 0 0.5rem 0;
      padding: 0 1.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1.5rem;
      margin: 0.25rem 1rem;
      border: none;
      background: transparent;
      color: var(--gray-600);
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      width: calc(100% - 2rem);
    }

    .nav-item:hover {
      background: var(--gray-100);
      color: var(--gray-800);
    }

    .nav-item.active {
      background: var(--primary-100);
      color: var(--primary-700);
      font-weight: 600;
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .nav-content {
      flex: 1;
      min-width: 0;
    }

    .nav-label {
      display: block;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-description {
      display: block;
      font-size: 0.75rem;
      color: var(--gray-500);
      margin-top: 0.125rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-footer {
      padding: 1rem 0;
      border-top: 1px solid var(--gray-200);
    }

    .logout-item {
      color: var(--danger-600);
    }

    .logout-item:hover {
      background: var(--danger-50);
      color: var(--danger-700);
    }

    /* Mobile Sidebar */
    .sidebar-mobile-toggle {
      display: none;
      position: fixed;
      top: 0.75rem;
      left: 0.75rem;
      width: 40px;
      height: 40px;
      background: var(--primary-600);
      border: none;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(99, 102, 241, 0.3);
      z-index: 1001;
      cursor: pointer;
      color: var(--white);
      transition: all 0.2s ease;
    }

    .sidebar-mobile-toggle:hover {
      background: var(--primary-700);
      transform: scale(1.05);
    }

    .sidebar-mobile-toggle svg {
      width: 20px;
      height: 20px;
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    .desktop-only {
      display: block;
    }

    

    /* Quick Actions Floating Button */
    .quick-actions {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1000;
    }

    .quick-actions-fab {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: var(--primary-600);
      color: var(--white);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .quick-actions-fab:hover {
      background: var(--primary-700);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
    }

    .quick-actions-fab.open {
      transform: rotate(45deg);
    }

    .quick-actions-fab svg {
      width: 24px;
      height: 24px;
    }

    .quick-actions-menu {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 280px;
      background: var(--white);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border: 1px solid var(--gray-200);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s ease;
    }

    .quick-actions-menu.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .quick-actions-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--gray-200);
      color: var(--gray-800);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .quick-actions-header svg {
      width: 18px;
      height: 18px;
      color: var(--primary-600);
    }

    .quick-action-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      opacity: 0;
      transform: translateX(-20px);
      animation: slideInAction 0.3s ease forwards;
    }

    .quick-action-item:hover {
      background: var(--gray-50);
    }

    .quick-action-item:last-child {
      border-radius: 0 0 12px 12px;
    }

    .action-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .quick-action-item.primary .action-icon {
      background: var(--primary-100);
      color: var(--primary-600);
    }

    .quick-action-item.success .action-icon {
      background: var(--success-100);
      color: var(--success-600);
    }

    .quick-action-item.warning .action-icon {
      background: var(--warning-100);
      color: var(--warning-600);
    }

    .quick-action-item.info .action-icon {
      background: var(--info-100);
      color: var(--info-600);
    }

    .action-icon svg {
      width: 20px;
      height: 20px;
    }

    .action-content {
      flex: 1;
    }

    .action-label {
      display: block;
      font-weight: 600;
      color: var(--gray-800);
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .action-description {
      display: block;
      color: var(--gray-600);
      font-size: 0.8rem;
      line-height: 1.4;
    }

    .quick-actions-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      z-index: -1;
    }

    @keyframes slideInAction {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Responsive Sidebar */
    @media (max-width: 768px) {
      .app-layout {
        position: relative;
      }

      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        transform: translateX(-100%);
        z-index: 1000;
    
        
        overflow-y: auto;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .sidebar-mobile-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .desktop-only {
        display: none;
      }

      .header-container {
        padding: 0 1rem 0 3.5rem;
        height: 60px;
      }

      .page-title h2 {
        font-size: 1.2rem;
        margin: 0;
        color: var(--primary-600);
        font-weight: 600;
      }

      .content-area {
        padding: 1rem;
      }

      .breadcrumb-container {
        padding: 0 1rem;
      }

      .breadcrumb-item span {
        display: none;
      }

      .breadcrumb-item.current span {
        display: inline;
      }

      .quick-actions {
        bottom: 1rem;
        right: 1rem;
      }

      .quick-actions-menu {
        width: 260px;
        right: -10px;
      }

      .nav-description {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .header-container {
        height: 55px;
        padding: 0 0.75rem 0 3rem;
      }

      .page-title h2 {
        font-size: 1rem;
      }

      .sidebar-mobile-toggle {
        width: 36px;
        height: 36px;
        top: 0.4rem;
        left: 0.2rem;
      }

      .sidebar-mobile-toggle svg {
        width: 18px;
        height: 18px;
      }

      .quick-actions-fab {
        width: 48px;
        height: 48px;
      }

      .quick-actions-fab svg {
        width: 20px;
        height: 20px;
      }

      .sidebar {
        height: auto;
        max-height: 100vh;
      }
    }

    /* Back Button Component */
    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--gray-300);
      background: var(--white);
      color: var(--gray-700);
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      margin-bottom: 1.5rem;
    }

    .back-button:hover {
      background: var(--gray-50);
      border-color: var(--gray-400);
      color: var(--gray-800);
      transform: translateX(-2px);
    }

    .back-button svg {
      width: 16px;
      height: 16px;
    }

    .back-button-primary {
      background: var(--primary-600);
      color: var(--white);
      border-color: var(--primary-600);
    }

    .back-button-primary:hover {
      background: var(--primary-700);
      border-color: var(--primary-700);
      color: var(--white);
    }

    .back-button-ghost {
      background: transparent;
      border-color: transparent;
      color: var(--gray-600);
      padding: 0.5rem;
    }

    .back-button-ghost:hover {
      background: var(--gray-100);
      color: var(--gray-800);
    }

    /* Create LOTO Page Styles */
    .create-loto-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
      min-height: 100vh;
    }

    .create-loto-header {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-100);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-main {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    }

    .header-text h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--gray-900);
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-text p {
      margin: 0.5rem 0 0 0;
      color: var(--gray-600);
      font-size: 1.1rem;
    }

    .header-actions .btn-secondary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--gray-100);
      border: 2px solid var(--gray-200);
      border-radius: 12px;
      color: var(--gray-700);
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .header-actions .btn-secondary:hover {
      background: var(--gray-200);
      border-color: var(--gray-300);
      transform: translateY(-1px);
    }

    /* Progress Indicator */
    .progress-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1rem 0;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.4;
      transition: all 0.3s ease;
    }

    .progress-step.active {
      opacity: 1;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--gray-200);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--gray-600);
      transition: all 0.3s ease;
    }

    .progress-step.active .step-number {
      background: var(--primary-500);
      color: var(--white);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .progress-step span {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-600);
    }

    .progress-step.active span {
      color: var(--primary-600);
    }
/* ✅ Completed Step Styling - Modern Look */
.progress-step.completed .step-number {
  background: var(--green-500) !important;
  color: #ffffff !important; /* clean white for contrast */
  box-shadow: 0 4px 10px rgba(34, 197, 94, 0.35) !important;
  border: 2px solid var(--green-400) !important;
  font-weight: 600 !important;
  transform: scale(1.05);
  transition: all 0.25s ease-in-out;
}

/* ✨ Subtle animation when appearing or hovered */
.progress-step.completed .step-number:hover {
  box-shadow: 0 6px 14px rgba(34, 197, 94, 0.45);
  transform: scale(1.1);
}


    .progress-step.completed span {
      color: var(--green-600);
    }

    .progress-step {
      cursor: pointer;
    }

    .progress-step:hover:not(.active) {
      opacity: 0.7;
    }

    .progress-line {
      width: 60px;
      height: 2px;
      background: var(--gray-200);
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .progress-line.completed {
      background: var(--green-400);
    }

    /* Error Banner */
    .error-banner {
      background: linear-gradient(135deg, var(--red-50) 0%, var(--red-100) 100%);
      border: 2px solid var(--red-200);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);
    }

    .error-content {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .error-content svg {
      color: var(--red-500);
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .error-text strong {
      display: block;
      color: var(--red-800);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .error-text p {
      color: var(--red-700);
      margin: 0;
    }

    /* Form Sections */
    .create-loto-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      background: var(--white);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-100);
      transition: all 0.3s ease;
    }

    .form-section:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .section-header {
      background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .section-icon {
      width: 48px;
      height: 48px;
      background: var(--primary-500);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--white);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    }

    .section-title h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--gray-900);
    }

    .section-title p {
      margin: 0.25rem 0 0 0;
      color: var(--gray-600);
      font-size: 0.95rem;
    }

    .section-content {
      padding: 2rem;
      width: 100%;
      box-sizing: border-box;
    }

    /* Form Grid and Fields */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      align-items: start;
      width: 100%;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: auto;
      visibility: visible;
      opacity: 1;
      width: 100%;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      align-items: stretch;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      margin: 0;
      padding: 0;
      align-self: stretch;
      justify-self: stretch;
    }

    /* Specific rule for PTW field */
    input[name="ptwNumber"] {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      width: 100% !important;
      box-sizing: border-box !important;
      margin: 0 !important;
      padding: 1rem 1.25rem !important;
      text-align: left !important;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--gray-700);
      font-size: 0.95rem;
    }

    .field-label svg {
      color: var(--primary-500);
    }

    .field-input {
      padding: 1rem 1.25rem;
      border: 2px solid var(--gray-200);
      border-radius: 12px;
      background: var(--white);
      color: var(--gray-900);
      width: 100%;
      box-sizing: border-box;
      font-size: 1rem;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .field-input:focus {
      outline: none;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      background: var(--white);
    }

    .field-input::placeholder {
      color: var(--gray-400);
    }

    /* Location Hierarchy */
    .location-hierarchy {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .hierarchy-step {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.5rem;
      background: var(--gray-50);
      border-radius: 16px;
      border: 2px solid var(--gray-100);
      transition: all 0.2s ease;
    }

    .hierarchy-step:hover {
      border-color: var(--primary-200);
      background: var(--primary-50);
    }

    .location-select {
      font-weight: 500;
    }

    /* Energy Types */
    .energy-types-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .energy-type-card {
      background: var(--gray-50);
      border: 2px solid var(--gray-200);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .energy-type-card:hover {
      border-color: var(--primary-300);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
    }

    .energy-card-header {
      background: var(--white);
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .energy-card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--gray-800);
    }

    .energy-card-title svg {
      color: var(--amber-500);
    }

    .remove-energy-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background: var(--red-100);
      color: var(--red-600);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .remove-energy-btn:hover:not(:disabled) {
      background: var(--red-200);
      transform: scale(1.05);
    }

    .remove-energy-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .energy-card-content {
      padding: 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .add-energy-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.25rem 2rem;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
      border: none;
      border-radius: 16px;
      color: var(--white);
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
    }

    .add-first-energy-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.5rem 2.5rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none;
      border-radius: 20px;
      color: white;
      font-weight: 600;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
      position: relative;
      overflow: hidden;
      min-height: 56px;
    }

    .add-first-energy-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    }

    .add-first-energy-btn:active {
      transform: translateY(-1px) scale(1.01);
    }

    .add-first-energy-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s;
    }

    .add-first-energy-btn:hover::before {
      transform: translateX(100%);
    }

    .add-energy-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
    }

    .add-energy-btn:active {
      transform: translateY(0);
    }

    /* Button icons styling */
    .add-first-energy-btn .btn-icon,
    .add-energy-btn .btn-icon {
      width: 20px;
      height: 20px;
      stroke-width: 2.5;
    }

    .add-first-energy-btn .btn-icon {
      width: 22px;
      height: 22px;
    }

    /* LOTO Table Responsiveness */
    .cf-table-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .cf-table {
      min-width: 800px;
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }

    .cf-table th,
    .cf-table td {
      padding: 1rem 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }

    .cf-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .cf-table tbody tr:hover {
      background: #f8fafc;
    }

    .cf-table tbody tr {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    /* Mobile Table Responsiveness */
    @media (max-width: 768px) {
      .cf-table-container {
        margin: 0 -1rem;
        border-radius: 0;
        box-shadow: none;
      }

      .cf-table {
        min-width: 600px;
        font-size: 0.875rem;
      }

      .cf-table th,
      .cf-table td {
        padding: 0.75rem 0.5rem;
      }

      /* Hide non-essential columns on mobile */
      .cf-table th:nth-child(3),
      .cf-table td:nth-child(3), /* Authorized Supervisor */
      .cf-table th:nth-child(4),
      .cf-table td:nth-child(4), /* Current Responsible */
      .cf-table th:nth-child(6),
      .cf-table td:nth-child(6) { /* Energy Types */
        display: none;
      }

      /* Make remaining columns more compact */
      .cf-table th:nth-child(1),
      .cf-table td:nth-child(1) { /* # */
        width: 40px;
        text-align: center;
      }

      .cf-table th:nth-child(2),
      .cf-table td:nth-child(2) { /* Serial Number */
        width: 120px;
      }

      .cf-table th:nth-child(5),
      .cf-table td:nth-child(5) { /* Isolator */
        width: 100px;
      }

      .cf-table th:nth-child(7),
      .cf-table td:nth-child(7) { /* Status */
        width: 120px;
      }

      .cf-table th:nth-child(8),
      .cf-table td:nth-child(8) { /* Actions */
        width: 80px;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .cf-table {
        min-width: 500px;
        font-size: 0.8rem;
      }

      .cf-table th,
      .cf-table td {
        padding: 0.5rem 0.25rem;
      }

      /* Further hide columns on very small screens */
      .cf-table th:nth-child(5),
      .cf-table td:nth-child(5) { /* Isolator */
        display: none;
      }
    }

    /* Desktop Table View */
    .desktop-table-view {
      display: block;
    }

    /* Mobile Card View Styling */
    .mobile-cards-view {
      display: none;
      padding: 0;
    }

    /* Responsive Display */
    @media (max-width: 767px) {
      .desktop-table-view {
        display: none;
      }
      
      .mobile-cards-view {
        display: block;
      }
    }

    .loto-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 1rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .loto-card:hover {
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .loto-card .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .loto-card .serial-info {
      display: flex;
      flex-direction: column;
    }

    .loto-card .serial-number {
      font-weight: 600;
      font-size: 1.1rem;
      color: #1f2937;
    }

    .loto-card .row-number {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .loto-card .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      border: 1px solid transparent;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: fit-content;
    }

    /* Mobile responsive status badges */
    @media (max-width: 480px) {
      .loto-card .status-badge {
        font-size: 0.65rem;
        padding: 0.2rem 0.4rem;
        max-width: 100px;
      }
    }

    .loto-card .card-content {
      padding: 1rem;
    }

    .loto-card .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .loto-card .info-row:last-child {
      border-bottom: none;
    }

    .loto-card .info-label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .loto-card .info-value {
      color: #6b7280;
      font-size: 0.875rem;
      text-align: right;
      max-width: 60%;
      word-break: break-word;
    }

    .loto-card .energy-types {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      justify-content: flex-end;
    }

    .loto-card .energy-tag {
      background: #e5e7eb;
      color: #374151;
      padding: 0.125rem 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .loto-card .card-actions {
      padding: 1rem;
      background: #f8fafc;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .loto-card .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      flex: 1;
      min-width: 80px;
    }

    .loto-card .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .loto-card .btn-primary:hover {
      background: #2563eb;
    }

    .loto-card .btn-warning {
      background: #f59e0b;
      color: white;
    }

    .loto-card .btn-warning:hover {
      background: #d97706;
    }

    .loto-card .btn-danger {
      background: #ef4444;
      color: white;
    }

    .loto-card .btn-danger:hover {
      background: #dc2626;
    }

    /* Status badge colors - Enhanced visibility */
    .status-badge.status-pending_verification_new,
    .status-pending_verification_new {
      background: #fef3c7 !important;
      color: #92400e !important;
      border: 1px solid #f59e0b !important;
    }

    .status-badge.status-active,
    .status-active {
      background: #d1fae5 !important;
      color: #065f46 !important;
      border: 1px solid #22c55e !important;
    }

    .status-badge.status-pending_handover_verification,
    .status-pending_handover_verification {
      background: #dbeafe !important;
      color: #1e40af !important;
      border: 1px solid #3b82f6 !important;
    }

    .status-badge.status-handed_over,
    .status-handed_over {
      background: #e0e7ff !important;
      color: #3730a3 !important;
      border: 1px solid #6366f1 !important;
    }

    .status-badge.status-completed,
    .status-completed {
      background: #dcfce7 !important;
      color: #166534 !important;
      border: 1px solid #22c55e !important;
    }

    .status-badge.status-rejected,
    .status-rejected {
      background: #fee2e2 !important;
      color: #991b1b !important;
      border: 1px solid #ef4444 !important;
    }

    /* Default status badge styling */
    .status-badge {
      background: #f3f4f6 !important;
      color: #374151 !important;
      border: 1px solid #d1d5db !important;
    }

    /* Table status pill styling */
    .status-pill {
      display: inline-flex !important;
      align-items: center !important;
      padding: 0.5rem 0.75rem !important;
      border-radius: 2rem !important;
      font-size: 0.7rem !important;
      font-weight: 600 !important;
      white-space: nowrap !important;
      border: 2px solid !important;
      max-width: 200px !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      min-width: fit-content !important;
    }

    /* Responsive table status pills */
    @media (max-width: 768px) {
      .status-pill {
        font-size: 0.65rem !important;
        padding: 0.4rem 0.6rem !important;
        max-width: 150px !important;
      }
    }

    @media (max-width: 480px) {
      .status-pill {
        font-size: 0.6rem !important;
        padding: 0.3rem 0.5rem !important;
        max-width: 120px !important;
      }
    }

    /* Search and Filter Responsive Styles */
    .search-filter-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .search-input-wrapper {
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      outline: none;
    }

    .search-input::-webkit-search-decoration,
    .search-input::-webkit-search-cancel-button,
    .search-input::-webkit-search-results-button,
    .search-input::-webkit-search-results-decoration {
      -webkit-appearance: none;
      appearance: none;
    }

    /* General Text Input Class */
    .cf-form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background: white;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      outline: none;
      font-family: inherit;
    }

    .cf-form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .cf-form-input::placeholder {
      color: #9ca3af;
    }

    .cf-form-input::-webkit-search-decoration,
    .cf-form-input::-webkit-search-cancel-button,
    .cf-form-input::-webkit-search-results-button,
    .cf-form-input::-webkit-search-results-decoration {
      -webkit-appearance: none;
      appearance: none;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-wrapper {
      flex: 1;
      min-width: 150px;
    }

    .filter-wrapper select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      background: white;
      transition: all 0.2s ease;
    }

    .filter-wrapper select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .search-filter-container {
        gap: 0.75rem;
      }

      .filter-row {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
      }

      .filter-wrapper {
        min-width: unset;
        width: 100%;
      }

      .search-input,
      .filter-wrapper select {
        font-size: 0.875rem;
        padding: 0.625rem 0.875rem;
      }
    }

    @media (max-width: 480px) {
      .search-input {
        font-size: 0.8rem;
        padding: 0.5rem 0.75rem;
      }

      .filter-wrapper select {
        font-size: 0.8rem;
        padding: 0.5rem 0.75rem;
      }
    }

    /* Active Filters Styles */
    .active-filters-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filters-info {
      flex: 1;
      min-width: 200px;
    }

    .filters-label {
      display: block;
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .filters-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .cf-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .cf-bg-primary {
      background: #dbeafe;
      color: #1e40af;
    }

    .cf-bg-info {
      background: #e0f2fe;
      color: #0369a1;
    }

    .cf-bg-warning {
      background: #fef3c7;
      color: #92400e;
    }

    .clear-filters-btn {
      background: #f3f4f6;
      color: #6b7280;
      border: 2px solid #e5e7eb;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .clear-filters-btn:hover {
      background: #e5e7eb;
      color: #374151;
      border-color: #d1d5db;
    }

    /* Mobile Responsiveness for Active Filters */
    @media (max-width: 768px) {
      .active-filters-container {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .filters-info {
        min-width: unset;
      }

      .clear-filters-btn {
        align-self: flex-start;
        font-size: 0.8rem;
        padding: 0.5rem 0.875rem;
      }
    }

    /* Empty Energy Types State */
    .empty-energy-types {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      padding: 2rem;
    }

    .empty-energy-types .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    .empty-energy-types .empty-state h4 {
      margin: 1.5rem 0 1rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .empty-energy-types .empty-state p {
      margin: 0 0 2rem 0;
      font-size: 1rem;
      color: #6b7280;
      line-height: 1.5;
    }

    /* Mobile responsiveness for empty energy types */
    @media (max-width: 768px) {
      .empty-energy-types {
        min-height: 250px;
        padding: 1.5rem 1rem;
      }

      .empty-energy-types .empty-state h4 {
        font-size: 1.25rem;
        margin: 1rem 0 0.75rem 0;
      }

      .empty-energy-types .empty-state p {
        font-size: 0.9rem;
        margin: 0 0 1.5rem 0;
      }

      .add-first-energy-btn {
        padding: 1.25rem 2rem;
        font-size: 1rem;
        min-height: 50px;
      }
    }

    /* Form Actions */
    .form-actions {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-100);
    }

    .actions-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .actions-info h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--gray-900);
    }

    .actions-info p {
      margin: 0;
      color: var(--gray-600);
      font-size: 1rem;
    }

    .actions-buttons {
      display: flex;
      gap: 1rem;
      flex-shrink: 0;
    }

    .submit-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, var(--green-500) 0%, var(--green-600) 100%);
      border: none;
      border-radius: 16px;
      color: var(--white);
      font-weight: 600;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .actions-buttons .btn-secondary {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: var(--gray-100);
      border: 2px solid var(--gray-200);
      border-radius: 16px;
      color: var(--gray-700);
      font-weight: 600;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .actions-buttons .btn-secondary:hover:not(:disabled) {
      background: var(--gray-200);
      border-color: var(--gray-300);
      transform: translateY(-1px);
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid var(--white);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive Design */
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
        gap: 1rem;
      }

      .header-text h1 {
        font-size: 2rem;
      }

      .progress-indicator {
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .progress-step span {
        font-size: 0.75rem;
      }

      .progress-line {
        width: 40px;
      }

      .section-header {
        padding: 1rem 1.5rem;
      }

      .section-content {
        padding: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .energy-card-content {
        grid-template-columns: 1fr;
      }

      .actions-content {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }

      .actions-buttons {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .header-icon {
        width: 48px;
        height: 48px;
      }

      .header-text h1 {
        font-size: 1.75rem;
      }

      .section-icon {
        width: 40px;
        height: 40px;
      }

      .section-title h3 {
        font-size: 1.25rem;
      }

      .actions-buttons {
        flex-direction: column;
      }
    }

    /* Wizard Navigation Styles */
    .wizard-navigation {
      background: var(--white);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--gray-100);
      margin-top: 2rem;
    }

    .nav-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .nav-buttons {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .nav-btn {
        width: 100%;
        justify-content: center;
        padding: 1rem 1.5rem !important;
        font-size: 1rem !important;
      }
      
      .wizard-navigation {
        padding: 1.5rem !important;
        margin-top: 1.5rem !important;
      }
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      border-radius: 16px;
      font-weight: 600;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      position: relative;
      overflow: hidden;
      min-height: 48px;
      text-decoration: none;
      user-select: none;
      outline: none;
    }

    .nav-btn:focus {
      outline: 2px solid rgba(102, 126, 234, 0.5);
      outline-offset: 2px;
    }

    /* Field validation styles */
    .field-input.invalid {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      animation: shake 0.5s ease-in-out;
    }

    .field-input.invalid:focus {
      border-color: #dc2626 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* Energy type card validation */
    .energy-type-card.invalid {
      border: 2px solid #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
      animation: pulse-red 1s ease-in-out;
    }

    @keyframes pulse-red {
      0%, 100% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
      50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.2); }
    }

    /* Progress step validation indicators */
    .progress-step.invalid {
      background: rgba(239, 68, 68, 0.1) !important;
      border-color: #ef4444 !important;
      color: #dc2626 !important;
    }

    .progress-step.invalid .step-number {
      background: #ef4444 !important;
      color: white !important;
      animation: pulse-red 1s ease-in-out infinite;
    }

    .progress-step.valid {
      background: rgba(16, 185, 129, 0.1) !important;
      border-color: #10b981 !important;
    }

    /* Mobile progress dots validation */
    .progress-dot.invalid {
      background: #ef4444 !important;
      color: white !important;
      animation: pulse-red 1s ease-in-out infinite;
      border: 2px solid #dc2626 !important;
    }

    .progress-dot.valid {
      background: #10b981 !important;
      color: white !important;
      border: 2px solid #059669 !important;
    }

    .nav-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .nav-btn:hover:not(.disabled) {
      transform: translateY(-1px);
    }

    /* Navigation button specific styles */
    .nav-btn.btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border: none !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4) !important;
      font-weight: 600 !important;
      font-size: 1.1rem !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .nav-btn.btn-primary::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent) !important;
      transform: translateX(-100%) !important;
      transition: transform 0.6s !important;
    }

    .nav-btn.btn-primary:hover::before {
      transform: translateX(100%) !important;
    }

    .nav-btn.btn-primary:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
    }

    .nav-btn.btn-secondary {
      background: rgba(255, 255, 255, 0.9) !important;
      color: #667eea !important;
      border: 2px solid #667eea !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2) !important;
      font-weight: 600 !important;
      font-size: 1.1rem !important;
      backdrop-filter: blur(10px) !important;
    }

    .nav-btn.btn-secondary:hover {
      background: #667eea !important;
      color: white !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
    }

    .nav-btn.btn-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      color: white !important;
      border: none !important;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4) !important;
      font-weight: 600 !important;
      font-size: 1.1rem !important;
      position: relative !important;
      overflow: hidden !important;
    }

    .nav-btn.btn-success::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent) !important;
      transform: translateX(-100%) !important;
      transition: transform 0.6s !important;
    }

    .nav-btn.btn-success:hover::before {
      transform: translateX(100%) !important;
    }

    .nav-btn.btn-success:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5) !important;
    }

    .nav-btn.submit-btn {
      animation: pulse 2s infinite !important;
      font-size: 1.2rem !important;
      padding: 1.2rem 2.5rem !important;
    }

    .nav-btn.submit-btn:hover {
      animation: none !important;
      transform: translateY(-3px) scale(1.02) !important;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      }
      50% {
        box-shadow: 0 6px 25px rgba(16, 185, 129, 0.6);
      }
      100% {
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      }
    }

    .nav-btn.btn-outline {
      background: rgba(255, 255, 255, 0.95) !important;
      color: #6b7280 !important;
      border: 2px solid #d1d5db !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
      font-weight: 600 !important;
      font-size: 1.1rem !important;
      backdrop-filter: blur(10px) !important;
      position: relative !important;
      overflow: hidden !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .nav-btn.btn-outline:hover {
      background: #f8fafc !important;
      color: #374151 !important;
      border-color: #9ca3af !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
    }

    .nav-btn.btn-outline:active {
      transform: translateY(0) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    .nav-btn.btn-outline:focus {
      outline: 2px solid rgba(156, 163, 175, 0.5) !important;
      outline-offset: 2px !important;
    }

    /* Cancel button specific styling */
    .nav-btn.btn-outline.cancel-btn {
      background: rgba(255, 255, 255, 0.95) !important;
      color: #dc2626 !important;
      border: 2px solid #fecaca !important;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1) !important;
    }

    .nav-btn.btn-outline.cancel-btn:hover {
      background: #fef2f2 !important;
      color: #b91c1c !important;
      border-color: #fca5a5 !important;
      box-shadow: 0 6px 20px rgba(220, 38, 38, 0.2) !important;
    }

    .nav-btn.btn-outline.cancel-btn:focus {
      outline: 2px solid rgba(220, 38, 38, 0.3) !important;
    }
      align-items: center !important;
      gap: 0.75rem !important;
    }

    .nav-btn.btn-primary:hover:not(.disabled) {
      background: var(--primary-700) !important;
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4) !important;
      transform: translateY(-2px) scale(1.02) !important;
    }

    .nav-btn.btn-primary:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
      transform: none !important;
      background: var(--gray-400) !important;
      color: var(--gray-600) !important;
    }

    .nav-btn.btn-secondary {
      background: var(--white) !important;
      color: var(--gray-700) !important;
      border: 1px solid var(--gray-300) !important;
      box-shadow: var(--shadow-xs) !important;
      font-weight: 600 !important;
      font-size: 1.1rem !important;
      padding: 1rem 2rem !important;
      border-radius: 12px !important;
      transition: all 0.2s ease !important;
      min-height: 48px !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.75rem !important;
    }

    .nav-btn.btn-secondary:hover:not(.disabled) {
      background: var(--gray-50) !important;
      border-color: var(--gray-400) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      transform: translateY(-1px) !important;
      color: var(--gray-800) !important;
    }

    .nav-btn.btn-secondary:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
      transform: none !important;
      background: var(--gray-100) !important;
      color: var(--gray-500) !important;
    }

/* 🔴 Best Cancel Button Styling */
element {
}
.nav-btn.btn-cancel {
  background: var(--danger-500);

  color: #131313 !important;
  border: 2px solid #fecaca !important;

  box-shadow: 0 2px 6px rgba(179, 54, 54, 0.32) !important;
  font-weight: 600 !important;
  font-size: 1.05rem !important;
  padding: 0.9rem 1.8rem !important;

  border-radius: 12px !important;

  transition: all 0.25s ease !important;

  min-height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.65rem !important;

  cursor: pointer !important;
}

/* 🌬️ Hover effect — soft red tint */
.nav-btn.btn-cancel:hover {
  background: rgb(164, 0, 0) !important;
  border-color: #f00 !important;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25) !important;
  transform: translateY(-1px);
}

/* 🫱 Active click feedback */
.nav-btn.btn-cancel:active {
  background: #fee2e2 !important;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2) !important;
  transform: translateY(0);
}

/* ♿ Focus state for accessibility */
.nav-btn.btn-cancel:focus-visible {
  outline: 3px solid rgba(220, 38, 38, 0.4) !important;
  outline-offset: 3px;
}


    /* Modern Stats Grid - Compact Responsive Design */
    .modern-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
  background: #1a1a1a3d;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border-color: var(--primary-200);
    }

    .stat-card.active {
     
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
      transform: translateY(-1px);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .stat-card.active::before {
      opacity: 1;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      margin-bottom: 0.75rem;
      position: relative;
    }

    .icon-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--gray-50);
      transition: all 0.2s ease;
    }

    .stat-svg {
      width: 20px;
      height: 20px;
      color: var(--gray-600);
      transition: all 0.2s ease;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--gray-900);
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 0.125rem;
    }

    .stat-description {
      font-size: 0.75rem;
      color: var(--gray-600);
      line-height: 1.3;
    }

    .stat-trend {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
    }

    .trend-indicator {
      font-size: 1rem;
      opacity: 0.7;
    }

    /* Card-specific color themes */
    .total-card .icon-wrapper {
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    }
    .total-card .stat-svg {
      color: var(--primary-600);
    }

    .active-card .icon-wrapper {
      background: linear-gradient(135deg, var(--success-100), var(--success-200));
    }
    .active-card .stat-svg {
      color: var(--success-600);
    }

    .pending-verification-card .icon-wrapper {
      background: linear-gradient(135deg, var(--warning-100), var(--warning-200));
    }
    .pending-verification-card .stat-svg {
      color: var(--warning-600);
    }

    .pending-handover-card .icon-wrapper {
      background: linear-gradient(135deg, var(--info-100), var(--info-200));
    }
    .pending-handover-card .stat-svg {
      color: var(--info-600);
    }

    .handed-over-card .icon-wrapper {
      background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    }
    .handed-over-card .stat-svg {
      color: var(--primary-600);
    }

    .rejected-card .icon-wrapper {
      background: linear-gradient(135deg, var(--danger-100), var(--danger-200));
    }
    .rejected-card .stat-svg {
      color: var(--danger-600);
    }

    .completed-card .icon-wrapper {
      background: linear-gradient(135deg, var(--gray-100), var(--gray-200));
    }
    .completed-card .stat-svg {
      color: var(--gray-600);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .modern-stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.875rem;
      }
      
      .stat-card {
        padding: 0.875rem;
      }
      
      .stat-number {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .modern-stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 0.75rem;
      }
      
      .stat-card {
        padding: 0.75rem;
      }
      
      .stat-icon {
        width: 35px;
        height: 35px;
        margin-bottom: 0.5rem;
      }
      
      .stat-svg {
        width: 18px;
        height: 18px;
      }
      
      .stat-number {
        font-size: 1.375rem;
      }
      
      .stat-label {
        font-size: 0.85rem;
      }
      
      .stat-description {
        font-size: 0.7rem;
      }
      
      .trend-indicator {
        font-size: 0.9rem;
      }
    }

    @media (max-width: 480px) {
      .modern-stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }
      
      .stat-card {
        padding: 0.625rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .stat-icon {
        width: 32px;
        height: 32px;
        margin-bottom: 0.375rem;
      }
      
      .stat-svg {
        width: 16px;
        height: 16px;
      }
      
      .stat-content {
        flex: 1;
        min-width: 0;
      }
      
      .stat-number {
        font-size: 1.25rem;
        margin-bottom: 0.125rem;
      }
      
      .stat-label {
        font-size: 0.8rem;
        margin-bottom: 0.0625rem;
      }
      
      .stat-description {
        font-size: 0.65rem;
        display: none; /* Hide description on very small screens */
      }
      
      .stat-trend {
        position: static;
        margin-top: 0.25rem;
      }
      
      .trend-indicator {
        font-size: 0.8rem;
      }
    }

    /* Review Section Styles */
    .review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .review-section {
      background: var(--gray-50);
      border-radius: 16px;
      padding: 1.5rem;
      border: 2px solid var(--gray-100);
    }

    .review-section.full-width {
      grid-column: 1 / -1;
    }

    .review-section h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--gray-800);
      border-bottom: 2px solid var(--gray-200);
      padding-bottom: 0.5rem;
    }

    .review-section h4 svg {
      color: var(--primary-500);
    }

    .review-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--gray-200);
    }

    .review-item:last-child {
      border-bottom: none;
    }

    .review-label {
      font-weight: 600;
      color: var(--gray-700);
      flex-shrink: 0;
      margin-right: 1rem;
    }

    .review-value {
      color: var(--gray-900);
      text-align: right;
      flex-grow: 1;
    }

    .energy-review-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .energy-review-item {
      background: var(--white);
      border-radius: 12px;
      padding: 1rem;
      border: 2px solid var(--gray-200);
    }

    .energy-review-item .energy-type {
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .energy-review-item .isolation-point {
      color: var(--gray-600);
      font-size: 0.95rem;
    }

    .no-energy-types {
      grid-column: 1 / -1;
      text-align: center;
      padding: 2rem;
      background: var(--warning-50);
      border: 2px dashed var(--warning-300);
      border-radius: 12px;
      color: var(--warning-700);
    }

    .no-energy-types p {
      margin: 0.5rem 0;
      font-size: 1rem;
    }

    .no-energy-types p:first-child {
      font-weight: 600;
      font-size: 1.1rem;
    }

    /* Responsive Wizard Styles */
    @media (max-width: 768px) {
      .wizard-navigation {
        padding: 1.5rem;
      }

      .nav-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .nav-btn {
        justify-content: center;
      }

      .review-grid {
        grid-template-columns: 1fr;
      }

      .energy-review-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .review-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .review-value {
        text-align: left;
      }
    }

    /* Create LOTO Responsive Styles */
    @media (max-width: 768px) {
      .create-loto-container {
        padding: 1rem;
      }

      .create-loto-header {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1.5rem;
      }

      .header-main {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
      }

      .header-text h1 {
        font-size: 2rem;
      }

      .header-actions {
        align-self: center;
      }

      .progress-indicator {
        gap: 0.5rem;
        justify-content: flex-start;
        overflow-x: auto;
        padding: 1rem 0.5rem;
      }

      .progress-step {
        flex-shrink: 0;
        min-width: 60px;
      }

      .progress-step span {
        font-size: 0.75rem;
        white-space: nowrap;
      }

      .progress-line {
        width: 40px;
        flex-shrink: 0;
      }

      .section-header {
        padding: 1rem 1.5rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .section-content {
        padding: 1.5rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .form-field.full-width {
        grid-column: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        align-items: stretch;
        justify-self: stretch;
      }

      .field-input {
        padding: 0.875rem 1rem;
        width: 100%;
        box-sizing: border-box;
      }
    }

    @media (max-width: 480px) {
      .create-loto-container {
        padding: 0.75rem;
      }

      .create-loto-header {
        padding: 1rem;
        border-radius: 16px;
      }

      .header-text h1 {
        font-size: 1.75rem;
      }

      .header-text p {
        font-size: 1rem;
      }

      .progress-indicator {
        padding: 0.75rem 0.25rem;
      }

      .progress-step {
        min-width: 50px;
      }

      .step-number {
        width: 32px;
        height: 32px;
        font-size: 0.875rem;
      }

      .progress-step span {
        font-size: 0.7rem;
      }

      .progress-line {
        width: 30px;
      }

      .section-header {
        padding: 1rem;
      }

      .section-icon {
        width: 40px;
        height: 40px;
      }

      .section-title h3 {
        font-size: 1.25rem;
      }

      .section-content {
        padding: 1rem;
      }

      .field-label {
        font-size: 0.9rem;
      }

      .form-field.full-width {
        grid-column: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        align-items: stretch;
        justify-self: stretch;
      }

      .field-input {
        padding: 0.75rem;
        font-size: 0.95rem;
        width: 100%;
        box-sizing: border-box;
      }
    }

    /* ============ Enhanced Search and Filter Section ============ */
    
    .search-filter-section {
      background: #b5b5b53d;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.8);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .search-filter-section:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    /* Search Container */
    .search-container {
      position: relative;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      z-index: 2;
      transition: color 0.2s ease;
    }

    .search-input-enhanced {
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.95rem;
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .search-input-enhanced:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);
      background: rgba(255, 255, 255, 1);
    }

    .search-input-enhanced:focus + .search-icon {
      color: #6366f1;
    }

    .clear-search-btn {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 6px;
      transition: all 0.2s ease;
      z-index: 2;
    }

    .clear-search-btn:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }

    /* Filter Container */
    .filter-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin: 0;
    }

    .filter-label svg {
      color: #6366f1;
    }

    .filter-select-enhanced {
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.95rem;
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      cursor: pointer;
    }

    .filter-select-enhanced:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);
      background: rgba(255, 255, 255, 1);
    }

    .filter-select-enhanced:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .search-filter-section {
        padding: 1rem;
        border-radius: 12px;
      }

      .search-input-enhanced,
      .filter-select-enhanced {
        padding: 0.75rem 0.875rem 0.75rem 2.5rem;
        font-size: 0.9rem;
      }

      .search-icon {
        left: 0.75rem;
      }

      .filter-label {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 576px) {
      .search-filter-section {
        padding: 0.75rem;
      }

      .search-input-enhanced,
      .filter-select-enhanced {
        padding: 0.625rem 0.75rem 0.625rem 2.25rem;
        font-size: 0.85rem;
      }

      .search-icon {
        left: 0.625rem;
      }
    }

    /* Footer Styles - Below Sidebar and Content */
    .footer-container {
      background-color: #1f2937;
      color: #f9fafb;
      border-top: 1px solid #374151;
      width: 100%; /* Full width - spans both sidebar and content */
      flex-shrink: 0; /* Prevent footer from shrinking */
    }

    .footer-content {
      max-width: 100%;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .footer-copyright {
      font-size: 14px;
      font-weight: 500;
      color: #d1d5db;
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f9fafb;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.3s ease;
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid transparent;
    }

    .footer-link:hover {
      border-color: currentColor;
    }

    .footer-link-email:hover {
      color: #3b82f6;
    }

    .footer-link-linkedin:hover {
      color: #0077b5;
    }

    .footer-powered {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 13px;
      color: #d1d5db;
    }

    .powered-text {
      color: #9ca3af;
      font-weight: 400;
    }

    .powered-name {
      color: #60a5fa;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      transition: all 0.3s ease;
    }

    .powered-name span {
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.3px;
    }

    .powered-name svg {
      color: #60a5fa;
      transition: all 0.3s ease;
    }

    .powered-name:hover {
      transform: scale(1.05);
    }

    .powered-name:hover span {
      background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .powered-name:hover svg {
      color: #3b82f6;
      transform: rotate(360deg);
    }

    /* Footer Terms and Privacy */
    .footer-terms {
      font-size: 13px;
      color: #d1d5db;
      text-align: center;
      line-height: 1.6;
      margin-bottom: 0.5rem;
    }

    .footer-terms-link {
      color: #60a5fa;
      text-decoration: underline;
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .footer-terms-link:hover {
      color: #3b82f6;
    }

    /* ===== RTL SUPPORT FOR FOOTER ===== */
    
    /* Footer Container RTL */
    html[dir="rtl"] .footer-container,
    [dir="rtl"] .footer-container,
    body[dir="rtl"] .footer-container,
    body.rtl .footer-container {
      direction: rtl;
    }

    /* Footer Content RTL */
    html[dir="rtl"] .footer-content,
    [dir="rtl"] .footer-content,
    body[dir="rtl"] .footer-content,
    body.rtl .footer-content {
      direction: rtl;
      /* Keep column layout, don't change to row-reverse */
    }

    /* Footer Copyright RTL */
    html[dir="rtl"] .footer-copyright,
    [dir="rtl"] .footer-copyright,
    body[dir="rtl"] .footer-copyright,
    body.rtl .footer-copyright {
      direction: rtl;
    }

    /* Footer Links RTL */
    html[dir="rtl"] .footer-links,
    [dir="rtl"] .footer-links,
    body[dir="rtl"] .footer-links,
    body.rtl .footer-links {
      direction: rtl;
      flex-direction: row-reverse;
    }

    /* Footer Link RTL */
    html[dir="rtl"] .footer-link,
    [dir="rtl"] .footer-link,
    body[dir="rtl"] .footer-link,
    body.rtl .footer-link {
      direction: ltr; /* Keep email and LinkedIn LTR */
      flex-direction: row-reverse;
    }

    /* Footer Powered RTL - Keep LTR order */
    html[dir="rtl"] .footer-powered,
    [dir="rtl"] .footer-powered,
    body[dir="rtl"] .footer-powered,
    body.rtl .footer-powered {
      direction: ltr; /* Keep "Powered by Name" order even in RTL */
      flex-direction: row; /* Don't reverse */
    }

    /* Footer Responsive Styles - Matching Header Container */
    @media (max-width: 768px) {
      .footer-content {
        padding: 0.75rem 1rem;
      }
    }

    @media (max-width: 576px) {
      .footer-content {
        padding: 0.5rem 0.75rem;
      }
    }

    /* ============ Legal Pages Styles (Privacy Policy & Terms of Service) ============ */
    
    .legal-page-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .legal-page-content {
      max-width: 900px;
      width: 100%;
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 3rem;
      margin: 2rem auto;
      position: relative;
    }

    .legal-page-content .back-button {
      position: absolute;
      top: 2rem;
      left: 2rem;
      background: transparent;
      border: 2px solid #0033a0;
      color: #0033a0;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .legal-page-content .back-button:hover {
      background: #0033a0;
      color: #ffffff;
      transform: translateX(-3px);
    }

    .legal-page-content h1 {
      color: #0033a0;
      font-size: 2.5rem;
      font-weight: 700;
      margin-top: 3rem;
      margin-bottom: 0.5rem;
      text-align: center;
      border-bottom: 3px solid #0033a0;
      padding-bottom: 1rem;
    }

    .legal-page-content .last-updated {
      text-align: center;
      color: #6b7280;
      font-size: 0.9rem;
      font-style: italic;
      margin-bottom: 2rem;
    }

    .legal-page-content section {
      margin-bottom: 2.5rem;
    }

    .legal-page-content h2 {
      color: #1f2937;
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .legal-page-content h3 {
      color: #374151;
      font-size: 1.2rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .legal-page-content p {
      color: #4b5563;
      font-size: 1rem;
      line-height: 1.8;
      margin-bottom: 1rem;
    }

    .legal-page-content ul {
      margin: 1rem 0;
      padding-left: 2rem;
    }

    .legal-page-content li {
      color: #4b5563;
      font-size: 1rem;
      line-height: 1.8;
      margin-bottom: 0.5rem;
    }

    .legal-page-content a {
      color: #0033a0;
      text-decoration: underline;
      transition: color 0.2s ease;
    }

    .legal-page-content a:hover {
      color: #002070;
    }

    .legal-page-content strong {
      color: #1f2937;
      font-weight: 600;
    }

    .legal-page-content .contact-info {
      background: #f9fafb;
      border-left: 4px solid #0033a0;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;
    }

    .legal-page-content .contact-info p {
      margin-bottom: 0.5rem;
    }

    .legal-page-content .policy-footer {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.9rem;
    }

    .legal-page-content .policy-footer p {
      margin-bottom: 0.5rem;
    }

    .legal-page-content .acknowledgment-section {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 12px;
      padding: 2rem;
      margin-top: 2rem;
    }

    .legal-page-content .acknowledgment-section h2 {
      color: #92400e;
      border-bottom: 2px solid #f59e0b;
    }

    .legal-page-content .important-notice {
      color: #92400e;
      font-weight: 600;
      font-size: 1.05rem;
    }

    .legal-page-content .safety-reminder {
      color: #dc2626;
      font-weight: 700;
      font-size: 1.1rem;
      margin-top: 1rem;
      text-align: center;
    }

    /* Responsive Design for Legal Pages */
    @media (max-width: 768px) {
      .legal-page-content {
        padding: 2rem 1.5rem;
        margin: 1rem;
      }

      .legal-page-content .back-button {
        position: static;
        margin-bottom: 1rem;
        width: fit-content;
      }

      .legal-page-content h1 {
        font-size: 2rem;
        margin-top: 1rem;
      }

      .legal-page-content h2 {
        font-size: 1.3rem;
      }

      .legal-page-content h3 {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 576px) {
      .legal-page-container {
        padding: 1rem 0.5rem;
      }

      .legal-page-content {
        padding: 1.5rem 1rem;
        border-radius: 12px;
      }

      .legal-page-content h1 {
        font-size: 1.75rem;
      }

      .legal-page-content p,
      .legal-page-content li {
        font-size: 0.95rem;
      }

      .legal-page-content ul {
        padding-left: 1.5rem;
      }
    }
    }
  `}</style>
);
export default GlobalStyles;

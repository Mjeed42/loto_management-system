import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";

const Breadcrumb = ({ customBreadcrumbs = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Default breadcrumb mapping
  const getBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", path: "/Home", icon: "home" }];

    // Map common paths
    const pathMap = {
      "loto-list": { label: "My LOTOs", icon: "list" },
      "create-loto": { label: "Create LOTO", icon: "plus" },
      "admin": { label: "Admin", icon: "settings" },
      "data-export": { label: "Data Export", icon: "download" },
      "monitoring": { label: "Monitoring", icon: "chart" },
      "notifications": { label: "Notifications", icon: "notification" },
    };

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      if (segment === "loto" && pathSegments[index + 1]) {
        // Handle LOTO detail pages
        const loToId = pathSegments[index + 1];
        breadcrumbs.push({
          label: "My LOTOs",
          path: "/loto-list",
          icon: "list"
        });
        breadcrumbs.push({
          label: `LOTO ${loToId.slice(-4)}`,
          path: `/loto/${loToId}`,
          icon: "file"
        });

        // Handle sub-pages
        if (pathSegments[index + 2]) {
          const subPage = pathSegments[index + 2];
          const subPageMap = {
            "update": { label: "Update", icon: "edit" },
            "handover": { label: "Handover", icon: "transfer" },
            "complete": { label: "Complete", icon: "check" }
          };
          
          if (subPageMap[subPage]) {
            breadcrumbs.push({
              label: subPageMap[subPage].label,
              path: currentPath,
              icon: subPageMap[subPage].icon
            });
          }
        }
        return;
      }

      if (pathMap[segment]) {
        breadcrumbs.push({
          label: pathMap[segment].label,
          path: currentPath,
          icon: pathMap[segment].icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="breadcrumb-nav">
      <div className="breadcrumb-container">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && (
              <Icon name="chevron-right" className="breadcrumb-separator" />
            )}
            <button
              className={`breadcrumb-item ${
                index === breadcrumbs.length - 1 ? "current" : ""
              }`}
              onClick={() => navigate(crumb.path)}
              disabled={index === breadcrumbs.length - 1}
            >
              <Icon name={crumb.icon} />
              <span>{crumb.label}</span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";

const SettingsDropdown = () => {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter(); // This is called at the top level of a functional component

  const menuItems = [
    {name: 'Change Password', route: '/change-credentials'},
    {name: 'DarkMode/LightMode', route: '/history'},
    {name: 'Signout', route: '/api/auth/signout'},
  ];

  const handleNavigation = (route: any) => {
    // This function will be called in response to a click event, which is a client-side interaction.
    if (route === '/api/auth/signout') {
      signOut({ callbackUrl: '/' });
    } else {
      // For other menu items, use the router to navigate
      router.push(route);
    }
  };

  return (
    <div className="dropdown"
         onMouseEnter={() => setIsHovering(true)}
         onMouseLeave={() => setIsHovering(false)}
    >
      <button className="dropdown-header">Settings</button>
      {isHovering && (
        <ul className="dropdown-list">
          {menuItems.map((item, index) => (
            <li className="dropdown-list-item" key={index}
                onClick={() => handleNavigation(item.route)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-header {
          background-color: #6a40de;
          color: black;
          padding: 16px;
          font-size: 16px;
          border: none;
          cursor: pointer;
        }

        .dropdown-list {
          display: block;
          position: absolute;
          background-color: #beb065;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        .dropdown-list-item {
          color: black;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
        }

        .dropdown-list-item:hover {
          background-color: #ddd;
        }
      `}</style>
    </div>
  );
};

export default SettingsDropdown;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";

interface MenuItem {
  name: string;
  route: string;
}

const SettingsDropdown = () => {
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const handleNavigation = (route: string) => {
    if (route === '/api/auth/signout') {
      signOut({ callbackUrl: '/' });
    } else {
      router.push(route);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    async function fetchProvider() {
      if (session?.user) {
        const response = await fetch(`/api/check-provider?email=${session.user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(' DATA:', data)

            console.log(' INSIDE IF PASSWORD CHAN')
            setMenuItems([
              {name: 'Change Password', route: '/change-credentials'},
              {name: 'DarkMode/LightMode', route: '/history'},
              {name: 'Signout', route: '/api/auth/signout'},
            ]);
          } else {
            console.log(' INSIDE IF PASSWORD CHAN NOT ALLOWED else 1')
            setMenuItems([
              {name: 'DarkMode/LightMode', route: '/history'},
              {name: 'Signout', route: '/api/auth/signout'},
            ]);
          }

      }
    }
    fetchProvider();
  }, [session, session?.user?.email]);

  return (
    <div className="dropdown"
         onMouseEnter={() => setIsHovering(true)}
         onMouseLeave={() => setIsHovering(false)}
    >
      <button className="dropdown-header">Settings</button>
       {isHovering && (
           <ul className="dropdown-list">
             {menuItems.map((item, index) => (
                 <li className="dropdown-list-item"
                     key={index}
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
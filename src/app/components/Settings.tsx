import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import styles from '@/app/Pages.module.css'
import Link from "next/link";

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
              {name: 'Signout', route: '/api/auth/signout'},
            ]);
          } else {
            console.log(' INSIDE IF PASSWORD CHAN NOT ALLOWED else 1')
            setMenuItems([
              {name: 'Signout', route: '/api/auth/signout'},
            ]);
          }

      }
    }
    fetchProvider();
  }, [session, session?.user?.email]);

  return (
    <div className={styles.dropdown}
         onMouseEnter={() => setIsHovering(true)}
         onMouseLeave={() => setIsHovering(false)}
    >
      <button className={styles["dropdown-header"]}>Settings</button>
       {isHovering && (
           <ul className={styles["dropdown-list"]}>
             {menuItems.map((item, index) => (
                 item.route !== '/api/auth/signout' ? (
              <li className={styles["dropdown-list-item"]} key={index}>
                <Link href={item.route}>
                  {item.name}
                </Link>
              </li>
            ) : (
              <li
                className={styles["dropdown-list-item"]}
                key={index}
                onClick={() => handleNavigation(item.route)}
              >
                {item.name}
              </li>
            )
             ))}
           </ul>
       )}
    </div>
  );
};

export default SettingsDropdown;
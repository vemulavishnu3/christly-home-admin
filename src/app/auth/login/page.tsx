import { redirect } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Christly Home</h1>
        <p className={styles.subtitle}>Admin Portal</p>
        <form className={styles.form} action={async () => {
          'use server';
          redirect('/admin/dashboard');
        }}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" defaultValue="admin@christlyhome.com" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" defaultValue="demo1234" />
          </div>
          <button type="submit" className={styles.button}>Sign In</button>
        </form>
        <div className={styles.demoInfo}>
          <p>Demo Accounts:</p>
          <small>admin@christlyhome.com / demo1234 (Super Admin)</small><br/>
          <small>church@gracefellowship.com / demo1234 (Church Admin)</small>
        </div>
      </div>
    </div>
  );
}

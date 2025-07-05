import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No user is currently logged in.');
  }

  const credential = EmailAuthProvider.credential(user.email!, currentPassword);

  try {
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    throw new Error('Failed to change password. Please check your current password and try again.');
  }
};
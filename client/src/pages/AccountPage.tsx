import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { format } from 'date-fns';

const AccountPage = () => {
  const { user, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const updatedUser = await authService.updateUser({
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        phoneNumber: formData.phoneNumber || null
      });
      
      updateUser(updatedUser);
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Please log in to view your account.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <div>
          <Button
            variant={isEditing ? 'outline' : 'hero'}
            onClick={() => setIsEditing(!isEditing)}
            className="ml-4"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button variant="destructive" onClick={handleLogout} className="ml-2">
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account's profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Username</Label>
                <p className="text-base">{user.username}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <p className="text-base">{user.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-base">{user.firstName || 'Not set'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                ) : (
                  <p className="text-base">{user.lastName || 'Not set'}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={isLoading}
                    type="tel"
                  />
                ) : (
                  <p className="text-base">{user.phoneNumber || 'Not set'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Label className="text-muted-foreground">Account created</Label>
            <p className="text-base">
              {user.createdAt ? format(new Date(user.createdAt), 'PPpp') : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground">Last updated</Label>
            <p className="text-base">
              {user.updatedAt ? format(new Date(user.updatedAt), 'PPpp') : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;

'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { KeyRound, User } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEmail('user@example.com');
    setName('Current User Name');
  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    console.log('Saving profile changes:', { name });
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Separator />

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
             <User className="mr-2 h-5 w-5" /> Profile
          </CardTitle>
          <CardDescription>
            Manage your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
             <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
             </div>
             <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  disabled
                />
             </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>

      {/* API Keys Section - Removed as keys are managed by the platform */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyRound className="mr-2 h-5 w-5" /> API Keys
          </CardTitle>
          <CardDescription>
            Manage your API keys for integrated services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="google-places-key">Google Places API Key</Label>
            <div className="flex items-center space-x-2">
              <Input id="google-places-key" type="password" value="******************" readOnly />
              <Button variant="outline" size="sm">Show</Button> 
              <Button variant="secondary" size="sm">Regenerate</Button> 
            </div>
             <p className="text-sm text-muted-foreground mt-1">Used for searching businesses and locations.</p>
          </div>
           <div>
            <Label htmlFor="pagespeed-key">PageSpeed Insights API Key</Label>
             <div className="flex items-center space-x-2">
              <Input id="pagespeed-key" type="password" value="******************" readOnly />
              <Button variant="outline" size="sm">Show</Button>
              <Button variant="secondary" size="sm">Regenerate</Button>
            </div>
             <p className="text-sm text-muted-foreground mt-1">Used for website performance analysis.</p>
          </div>
           <div>
            <Label htmlFor="firecrawl-key">Firecrawl API Key</Label>
             <div className="flex items-center space-x-2">
              <Input id="firecrawl-key" type="password" value="******************" readOnly />
               <Button variant="outline" size="sm">Show</Button>
               <Button variant="secondary" size="sm">Regenerate</Button>
             </div>
             <p className="text-sm text-muted-foreground mt-1">Used for scraping website content.</p>
           </div>
        </CardContent>
      </Card>
      */}

       {/* Add more sections like Notifications, Billing, Account Deletion as needed */}

    </div>
  );
} 
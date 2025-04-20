import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const SettingManager = () => {
    const { toast } = useToast();
    const [settings, setSettings] = useState({
        notificationEnabled: true,
        emailNotifications: true,
        pushNotifications: true,
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
    });

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = () => {
        // Here you would typically make an API call to save the settings
        toast({
            title: "Settings saved",
            description: "Your settings have been updated successfully.",
        });
    };

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <select
                                    id="language"
                                    className="w-full p-2 border rounded"
                                    value={settings.language}
                                    onChange={(e) => handleSettingChange('language', e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <select
                                    id="timezone"
                                    className="w-full p-2 border rounded"
                                    value={settings.timezone}
                                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="EST">EST</option>
                                    <option value="PST">PST</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications about your leave applications
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.notificationEnabled}
                                    onCheckedChange={(checked) => handleSettingChange('notificationEnabled', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications via email
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.emailNotifications}
                                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive push notifications
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.pushNotifications}
                                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme</Label>
                                <select
                                    id="theme"
                                    className="w-full p-2 border rounded"
                                    value={settings.theme}
                                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-6">
                <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
        </div>
    );
};

export default SettingManager;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus,
  UserCheck,
  ShieldCheck,
  Eye,
  RefreshCcw
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Sample users data
const initialUsers = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin@cargopilot.com',
    role: 'super_admin',
    active: true,
    lastLogin: '2025-05-05 08:45',
  },
  {
    id: 2,
    name: 'Wati Susanti',
    email: 'wati@cargopilot.com',
    role: 'admin',
    active: true,
    lastLogin: '2025-05-04 14:30',
  },
  {
    id: 3,
    name: 'Hadi Gunawan',
    email: 'hadi@cargopilot.com',
    role: 'viewer',
    active: true,
    lastLogin: '2025-05-05 10:15',
  },
];

// Helper function to get role badge
const getRoleBadge = (role) => {
  switch(role) {
    case 'super_admin':
      return <Badge variant="default" className="bg-rose-500">Super Admin</Badge>;
    case 'admin':
      return <Badge variant="default" className="bg-blue-500">Admin</Badge>;
    case 'viewer':
      return <Badge variant="outline">Viewer</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
};

const UserForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingUser = null 
}) => {
  const [name, setName] = useState(editingUser?.name || '');
  const [email, setEmail] = useState(editingUser?.email || '');
  const [role, setRole] = useState(editingUser?.role || 'viewer');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(editingUser?.active ?? true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      id: editingUser?.id || Date.now(),
      name,
      email,
      role,
      active,
      lastLogin: editingUser?.lastLogin || '-',
    };
    
    onSave(user);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {!editingUser && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required={!editingUser} 
                autoComplete="new-password"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="active" 
              checked={active} 
              onCheckedChange={setActive}
            />
            <Label htmlFor="active">Akun Aktif</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {editingUser ? 'Simpan' : 'Tambah Pengguna'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddNewUser = () => {
    setEditingUser(null);
    setShowDialog(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleSaveUser = (user) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => 
        prev.map(u => u.id === user.id ? user : u)
      );
      toast.success('Data pengguna berhasil diperbarui');
    } else {
      // Add new user
      setUsers(prev => [...prev, user]);
      toast.success('Pengguna baru berhasil ditambahkan');
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast.success('Pengguna berhasil dihapus');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Pengguna</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={handleAddNewUser}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-64">
                <Input 
                  placeholder="Cari pengguna..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter berdasarkan role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Login Terakhir</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.active ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aktif</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Nonaktif</Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCcw className="mr-2 h-4 w-4" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Tidak ada data pengguna yang sesuai
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Log Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Aktivitas</TableHead>
                  <TableHead>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2025-05-05 10:45</TableCell>
                  <TableCell>Administrator</TableCell>
                  <TableCell>Pengiriman dibuat</TableCell>
                  <TableCell>Nomor resi: CGO123456</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2025-05-05 09:30</TableCell>
                  <TableCell>Wati Susanti</TableCell>
                  <TableCell>Status diperbarui</TableCell>
                  <TableCell>Resi CGO345678: Pickup → Transit</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2025-05-05 09:15</TableCell>
                  <TableCell>Hadi Gunawan</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>Login berhasil</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserForm
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
    </div>
  );
};

export default Users;

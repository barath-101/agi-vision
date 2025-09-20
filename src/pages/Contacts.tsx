import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVoice } from "@/hooks/useVoice";
import { toast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  Phone, 
  MessageSquare, 
  Edit, 
  Trash2,
  Star,
  Heart,
  Shield,
  User
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  isPrimary: boolean;
  notes?: string;
}

const initialContacts: Contact[] = [
  { id: "1", name: "Dr. Sarah Johnson", phone: "+1-555-0123", relation: "Doctor", isPrimary: true, notes: "Primary care physician" },
  { id: "2", name: "Mike Chen", phone: "+1-555-0124", relation: "Family", isPrimary: true, notes: "Brother - emergency contact" },
  { id: "3", name: "Lisa Park", phone: "+1-555-0125", relation: "Friend", isPrimary: false, notes: "Close friend and neighbor" },
  { id: "4", name: "Emergency Services", phone: "911", relation: "Emergency", isPrimary: true, notes: "Emergency services" },
  { id: "5", name: "Mom", phone: "+1-555-0126", relation: "Family", isPrimary: true, notes: "Mother" },
];

export default function Contacts() {
  const { speak } = useVoice();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relation: "",
    isPrimary: false,
    notes: ""
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const primaryContacts = filteredContacts.filter(c => c.isPrimary);
  const secondaryContacts = filteredContacts.filter(c => !c.isPrimary);

  const getContactIcon = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'emergency': return Shield;
      case 'doctor': case 'medical': return Heart;
      case 'family': return Star;
      default: return User;
    }
  };

  const getContactColor = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'emergency': return 'bg-emergency';
      case 'doctor': case 'medical': return 'bg-accent';
      case 'family': return 'bg-secondary';
      default: return 'bg-primary';
    }
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and phone number.",
        variant: "destructive",
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: "", phone: "", relation: "", isPrimary: false, notes: "" });
    setIsAddingContact(false);
    
    speak(`Contact ${newContact.name} added successfully.`);
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added to your contacts.`,
    });
  };

  const editContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      relation: contact.relation,
      isPrimary: contact.isPrimary,
      notes: contact.notes || ""
    });
  };

  const updateContact = () => {
    if (!editingContact) return;

    const updatedContacts = contacts.map(c =>
      c.id === editingContact.id
        ? { ...editingContact, ...newContact }
        : c
    );

    setContacts(updatedContacts);
    setEditingContact(null);
    setNewContact({ name: "", phone: "", relation: "", isPrimary: false, notes: "" });
    
    speak(`Contact ${newContact.name} updated successfully.`);
    toast({
      title: "Contact Updated",
      description: `${newContact.name} has been updated.`,
    });
  };

  const deleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(contacts.filter(c => c.id !== id));
    
    if (contact) {
      speak(`Contact ${contact.name} deleted.`);
      toast({
        title: "Contact Deleted",
        description: `${contact.name} has been removed from your contacts.`,
      });
    }
  };

  const callContact = (contact: Contact) => {
    speak(`Calling ${contact.name} at ${contact.phone}`);
    window.open(`tel:${contact.phone}`);
    toast({
      title: "Initiating Call",
      description: `Calling ${contact.name}...`,
    });
  };

  const messageContact = (contact: Contact) => {
    speak(`Preparing message for ${contact.name}`);
    toast({
      title: "Message Ready",
      description: `Prepared to message ${contact.name}`,
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary" />
            Contacts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage emergency and personal contacts
          </p>
        </div>
        
        <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-eco hover:shadow-eco">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Edit Contact" : "Add New Contact"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="+1-555-0123"
                />
              </div>
              <div>
                <Label htmlFor="relation">Relationship</Label>
                <Select value={newContact.relation} onValueChange={(value) => setNewContact({...newContact, relation: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Colleague">Colleague</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newContact.notes}
                  onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                  placeholder="Additional notes (optional)"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="primary"
                  checked={newContact.isPrimary}
                  onChange={(e) => setNewContact({...newContact, isPrimary: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="primary">Mark as primary emergency contact</Label>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={editingContact ? updateContact : addContact}
                  className="flex-1 bg-gradient-eco hover:shadow-eco"
                >
                  {editingContact ? "Update" : "Add"} Contact
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingContact(false);
                    setEditingContact(null);
                    setNewContact({ name: "", phone: "", relation: "", isPrimary: false, notes: "" });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Primary Contacts */}
      {primaryContacts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-primary" />
            Primary Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryContacts.map((contact) => {
              const IconComponent = getContactIcon(contact.relation);
              const colorClass = getContactColor(contact.relation);
              
              return (
                <Card key={contact.id} className="glass-card border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">{contact.relation}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Primary</Badge>
                    </div>
                    
                    <p className="text-sm mb-3 font-mono">{contact.phone}</p>
                    
                    {contact.notes && (
                      <p className="text-xs text-muted-foreground mb-3">{contact.notes}</p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => callContact(contact)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => messageContact(contact)}
                        className="flex-1"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editContact(contact)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteContact(contact.id)}
                        className="hover:bg-destructive hover:text-white"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Other Contacts */}
      {secondaryContacts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-secondary" />
            Other Contacts
          </h2>
          <div className="space-y-3">
            {secondaryContacts.map((contact) => {
              const IconComponent = getContactIcon(contact.relation);
              const colorClass = getContactColor(contact.relation);
              
              return (
                <Card key={contact.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {contact.relation} • {contact.phone}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => callContact(contact)}
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => messageContact(contact)}
                        >
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editContact(contact)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteContact(contact.id)}
                          className="hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {filteredContacts.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Contacts Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No contacts match your search." : "Add your first contact to get started."}
            </p>
            {searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            ) : (
              <Button onClick={() => setIsAddingContact(true)} className="bg-gradient-eco hover:shadow-eco">
                <Plus className="h-4 w-4 mr-2" />
                Add First Contact
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Voice Commands */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Contact Voice Commands</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>• "Call [contact name]"</div>
            <div>• "Message [contact name]"</div>
            <div>• "Show contacts"</div>
          </div>
          <div className="space-y-2">
            <div>• "Add new contact"</div>
            <div>• "Find [contact name]"</div>
            <div>• "Emergency contacts"</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

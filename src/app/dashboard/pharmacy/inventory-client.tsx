"use client";

import { useTransition, useState } from "react";
import { Plus, Minus, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { addMedicineAction, updateStockAction } from "@/actions/Pharmacy/index";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const medicineSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
});

interface InventoryItem {
  _id: string;
  medicineName: string;
  quantity: number;
  price: number;
}

interface InventoryClientProps {
  initialItems: InventoryItem[];
}

export default function InventoryClient({ initialItems }: InventoryClientProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const form = useForm<z.infer<typeof medicineSchema>>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      medicineName: "",
      quantity: 0,
      price: 0,
    },
  });

  const filteredItems = initialItems.filter(item => 
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onAddSubmit = (values: z.infer<typeof medicineSchema>) => {
    startTransition(async () => {
      const result = await addMedicineAction(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        setIsAddOpen(false);
        form.reset();
      }
    });
  };

  const handleUpdateStock = (id: string, increment: number) => {
    startTransition(async () => {
      const result = await updateStockAction(id, increment);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Pharmacy Inventory</h2>
          <p className="text-muted-foreground mt-1">Manage stock levels and medicine pricing.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 h-9 px-5 font-semibold text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Add New Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={form.handleSubmit(onAddSubmit)}>
              <DialogHeader>
                <DialogTitle>Add to Inventory</DialogTitle>
                <DialogDescription>
                  Enter the details for the new medicine item.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-4">
                <Field>
                  <FieldLabel>Medicine Name</FieldLabel>
                  <Input 
                    {...form.register("medicineName")}
                    placeholder="e.g. Paracetamol 500mg" 
                    className="h-10"
                  />
                  {form.formState.errors.medicineName && <FieldError>{form.formState.errors.medicineName.message}</FieldError>}
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Initial Stock</FieldLabel>
                    <Input 
                      type="number"
                      {...form.register("quantity", { valueAsNumber: true })}
                      placeholder="0" 
                      className="h-10"
                    />
                    {form.formState.errors.quantity && <FieldError>{form.formState.errors.quantity.message}</FieldError>}
                  </Field>
                  <Field>
                    <FieldLabel>Price ($)</FieldLabel>
                    <Input 
                      type="number"
                      step="0.01"
                      {...form.register("price", { valueAsNumber: true })}
                      placeholder="0.00" 
                      className="h-10"
                    />
                    {form.formState.errors.price && <FieldError>{form.formState.errors.price.message}</FieldError>}
                  </Field>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isPending ? "Adding..." : "Add Medicine"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Filter by medicine name..." 
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Medicine Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Price Per Unit</TableHead>
                <TableHead className="text-right pr-6">Quick Adjust</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    <Package className="mx-auto h-10 w-10 mb-2 opacity-15" />
                    <p>No medicines found in inventory.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item._id} className="group transition-colors hover:bg-muted/40">
                    <TableCell className="pl-6 font-medium text-foreground">
                      {item.medicineName}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium font-mono ${
                        item.quantity < 10
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/8 text-primary"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full inline-block ${
                          item.quantity < 10 ? "bg-destructive" : "bg-primary"
                        }`} />
                        {item.quantity} in stock
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground font-mono">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-2">
                       <Button 
                        variant="outline" 
                        size="icon" 
                        disabled={isPending || item.quantity <= 0}
                        onClick={() => handleUpdateStock(item._id, -1)}
                        className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive/8 hover:text-destructive"
                       >
                         <Minus className="h-3.5 w-3.5" />
                       </Button>
                       <Button 
                        variant="outline" 
                        size="icon" 
                        disabled={isPending}
                        onClick={() => handleUpdateStock(item._id, 1)}
                        className="h-8 w-8 text-success border-success/20 hover:bg-success/8 hover:text-success"
                       >
                         <Plus className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

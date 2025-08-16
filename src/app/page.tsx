"use client";

import { useState, useRef, useEffect } from "react";
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
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";


export default function Home() {
  const [initialCode, setInitialCode] = useState("");
  const [finalCode, setFinalCode] = useState("");
  const [rangeResult, setRangeResult] = useState<number | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanningFor, setScanningFor] = useState<"initial" | "final" | null>(
    null
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryTotals, setCategoryTotals] = useState({ A: 0, B: 0, C: 0 });


  useEffect(() => {
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          streamRef.current = stream;
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description:
              "Please enable camera permissions in your browser settings to use this app.",
          });
          setIsCameraOpen(false);
        }
      };

      getCameraPermission();
    } else {
      // Stop the camera stream when the dialog is closed
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    // Cleanup function to stop camera on component unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOpen, toast]);

  const handleScan = (field: "initial" | "final") => {
    setScanningFor(field);
    setIsCameraOpen(true);
    setRangeResult(null);
  };

  const handleProcess = () => {
    const initial = parseInt(initialCode, 10);
    const final = parseInt(finalCode, 10);

    if (isNaN(initial) || isNaN(final)) {
      toast({
        variant: "destructive",
        title: "Códigos Inválidos",
        description: "Por favor, insira o código inicial e final.",
      });
      setRangeResult(null);
      return;
    }

    if (final < initial) {
      toast({
        variant: "destructive",
        title: "Intervalo Inválido",
        description: "O código final deve ser maior ou igual ao código inicial.",
      });
      setRangeResult(null);
      return;
    }

    const range = final - initial + 1;
    setRangeResult(range);
    setSelectedCategory(null);
  };

  const handleCapture = () => {
    // Placeholder for barcode scanning logic
    const scannedCode = "1234567890"; // This would be replaced by actual barcode data
    if (scanningFor === "initial") {
      setInitialCode(scannedCode);
    } else if (scanningFor === "final") {
      setFinalCode(scannedCode);
    }
    setIsCameraOpen(false);
    toast({
      title: "Code Scanned",
      description: `Code ${scannedCode} captured for ${scanningFor} field.`,
    });
  };

  const handleSaveCount = () => {
    if (!selectedCategory || rangeResult === null) {
      toast({
        variant: "destructive",
        title: "Seleção Necessária",
        description: "Por favor, selecione uma categoria (A, B, ou C).",
      });
      return;
    }

    setCategoryTotals(prevTotals => ({
        ...prevTotals,
        [selectedCategory]: prevTotals[selectedCategory as keyof typeof prevTotals] + rangeResult
    }));

    setInitialCode("");
    setFinalCode("");
    setRangeResult(null);
    setSelectedCategory(null);

    toast({
        title: "Contagem Salva",
        description: `${rangeResult} SKPs adicionados à categoria ${selectedCategory}.`,
    })

  }

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Leitor de Código
            </CardTitle>
            <CardDescription>
              Insira o código inicial e final manualmente ou usando a câmera.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="initial-code">Código Inicial</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="initial-code"
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite ou escaneie o código"
                  className="flex-1"
                  value={initialCode}
                  onChange={(e) => {
                    setInitialCode(e.target.value)
                    setRangeResult(null);
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleScan("initial")}
                  aria-label="Escanear código inicial"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="final-code">Código Final</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="final-code"
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite ou escaneie o código"
                  className="flex-1"
                  value={finalCode}
                  onChange={(e) => {
                    setFinalCode(e.target.value)
                    setRangeResult(null);
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleScan("final")}
                  aria-label="Escanear código final"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {rangeResult === null && (
                 <Button className="w-full" onClick={handleProcess}>
                    Processar Códigos
                </Button>
            )}
            {rangeResult !== null && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">SKPs na sequência</p>
                    <p className="text-3xl font-bold tracking-tight">{rangeResult}</p>
                </div>
                <div className="grid gap-2">
                    <Label>Selecione a Categoria</Label>
                    <RadioGroup 
                        className="flex items-center gap-4" 
                        value={selectedCategory || ""}
                        onValueChange={setSelectedCategory}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="A" id="cat-a" />
                            <Label htmlFor="cat-a">A</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="B" id="cat-b" />
                            <Label htmlFor="cat-b">B</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="C" id="cat-c" />
                            <Label htmlFor="cat-c">C</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button className="w-full" onClick={handleSaveCount}>
                    Salvar Contagem
                </Button>
              </div>
            )}
             <Separator />
            <div className="space-y-2">
                <h3 className="font-medium">Totais por Categoria</h3>
                <div className="flex justify-between rounded-lg bg-muted p-3">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Categoria A</p>
                        <p className="text-2xl font-bold">{categoryTotals.A}</p>
                    </div>
                     <div className="text-center">
                        <p className="text-sm text-muted-foreground">Categoria B</p>
                        <p className="text-2xl font-bold">{categoryTotals.B}</p>
                    </div>
                     <div className="text-center">
                        <p className="text-sm text-muted-foreground">Categoria C</p>
                        <p className="text-2xl font-bold">{categoryTotals.C}</p>
                    </div>
                </div>
            </div>
          </CardContent>
          <CardFooter>
           
          </CardFooter>
        </Card>
      </main>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {hasCameraPermission === false && (
               <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
            )}
             <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline/>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission}>
              Capture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

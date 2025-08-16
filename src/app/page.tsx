"use client";

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

export default function Home() {
  const handleScan = (field: "initial" | "final") => {
    // This is a placeholder for the camera scanning functionality
    console.log(`Scanning for ${field} code...`);
    alert(
      `A funcionalidade da câmera para o código ${
        field === "initial" ? "inicial" : "final"
      } seria ativada aqui.`
    );
  };

  const handleProcess = () => {
    // This is a placeholder for processing the codes
    console.log("Processing codes...");
    alert("Processando os códigos inseridos.");
  };

  return (
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
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleProcess}>
            Processar Códigos
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

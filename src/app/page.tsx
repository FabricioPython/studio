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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  
  const agencies = [
    "ANGRA DOS REIS", "ARARUAMA", "ARMACAO DOS BUZIOS", "BARRA DO PIRAI", "03 DE OUTUBRO", 
    "BARRA MANSA", "BELFORD ROXO", "ESTRADA MANOEL DE SA", "SARAPUI", "BOM JARDIM", 
    "BOM JESUS DO ITABAPOANA", "BAIRRO SAO CRISTOVAO", "CABO FRIO", "CACHOEIRAS DE MACACU", 
    "BARAO DE MIRACEMA", "BENTA PEREIRA", "CAMPOS", "GUARUS", "PELINCA", "TURFE CLUBE", 
    "CANTAGALO", "CORDEIRO", "25 DE AGOSTO", "BRIGADEIRO LIMA E SILVA", "DUQUE DE CAXIAS", 
    "GRANDE RIO", "NILO PECANHA", "SANTA CRUZ DA SERRA", "GUAPIMIRIM", "ITABORAI", "MANILHA", 
    "ITAGUAI", "ITALVA", "ITAOCARA", "ITAPERUNA", "PEDRA PRETA", "ITATIAIA", "JAPERI", 
    "CAVALEIROS", "MACAE", "PARQUE VALENTINA MIRANDA", "PETROBRAS IMBETIBA", "MAGE", "MARICA", 
    "VILA DE SANTA MARIA", "MENDES", "MESQUITA", "MIGUEL PEREIRA", "MIRACEMA", "NATIVIDADE", 
    "BEIJA-FLOR", "NILOPOLIS", "NILOPOLITANA", "ESTACAO DAS BARCAS", "FONSECA", "ICARAI", 
    "INGA", "ITAIPU", "JOSE CLEMENTE", "LARGO DO MARRAO", "MIGUEL DE FRIAS", "NITEROI", 
    "PIRATININGA", "SAO FRANCISCO", "SHOPPING BAY MARKET", "CONSELHEIRO PAULINO", 
    "NOVA FRIBURGO", "OLARIA", "COMENDADOR SOARES", "ESTACAO NOVA IGUACU", "IGUACUANO", 
    "MARIO GUIMARAES", "NOVA IGUACU", "TOP SHOPPING", "PARACAMBI", "PARAIBA DO SUL", 
    "PARATY", "PATY DO ALFERES", "ALTO DA SERRA", "IMPERIAL", "ITAIPAVA", "PETROPOLIS", 
    "PINHEIRAL", "PIRAI", "PORCIUNCULA", "PORTO REAL", "QUATIS", "QUEIMADOS", "QUISSAMA", 
    "CIDADE ALEGRIA", "MANEJO", "RESENDE", "RIO BONITO", "JARDIM MARILEIA", "RIO DAS OSTRAS", 
    "28 DE SETEMBRO", "14 BIS", "AEROPORTO SANTOS DUMONT", "ALMIRANTE GONCALVES", 
    "ALMIRANTE TAMANDARE", "AMERICAS", "ANCHIETA", "ANDARAI", "ANIL", "ARMANDO LOMBARDI", 
    "ATAULFO DE PAIVA", "AV ABELARDO BUENO", "AV CHILE", "AV LOBO JUNIOR", 
    "AV MINISTRO ARI FRANCO", "AV RIO BRANCO", "BANDEIRA", "BANGU", "BARAO DE MESQUITA", 
    "BARATA RIBEIRO", "BARRA BUSINESS", "BARRA DA TIJUCA", "BONSUCESSO", "BOTAFOGO", "CACUIA", 
    "CARDEAL ARCOVERDE", "CASCADURA", "CATETE", "CINELANDIA", "COCOTA", "CONDE DE BONFIM", 
    "COPACABANA", "CURICICA", "DEODORO", "DIAS DA CRUZ", "DOWNTOWN", "ENGENHO DE DENTRO", 
    "ESTRADA DO GALEAO", "ESTRADA DOS BANDEIRANTES", "ESTRADA DOS TRES RIOS", "FREGUESIA", 
    "FREIRE ALEMAO", "GAVEA", "GUANABARA", "GUARATIBA", "HADDOCK LOBO", "INHANGA", "INHAUMA", 
    "IPANEMA", "JACAREPAGUA", "JARDIM BOTANICO", "JARDIM DO MEIER", "JARDIM OCEANICO", 
    "JORNALISTA ROBERTO MARINHO", "JT RIO DE JANEIRO", "LARANJEIRAS", "LARGO DA CARIOCA", 
    "LARGO DA GLORIA", "LARGO DO BICAO", "LEBLON", "LEME", "LEOPOLDINENSE", "LINO TEIXEIRA", 
    "MADUREIRA", "MADUREIRA SHOPPING", "MARECHAL MASCARENHAS", "MEIER", "MONSENHOR FELIX", 
    "NEW YORK CITY CENTER", "NORTE SHOPPING", "NOSSA SENHORA DA PAZ", "NOVA AMERICA", "NOVO RIO", 
    "OPEN MALL", "PACO IMPERIAL", "PALACIO DA FAZENDA", "PARQUE DE MARAPENDI", "PAVUNA", 
    "PECHINCHA", "PENHA", "PEQUENA AFRICA", "PEREIRA PASSOS", "PILARES", "PIO X", 
    "PRACA JAURU", "PRACA MAUA", "PRACA SECA", "PRAIA DE BOTAFOGO", "PRESIDENTE VARGAS", "RAMOS", 
    "REALENGO", "RECREIO DOS BANDEIRANTES", "RECREIO SHOPPING", "RIACHUELO", "RIO COMPRIDO", 
    "RIO DE JANEIRO", "RIO DO A", "RIO NORTE", "RIO OESTE", "RIO SUL", "ROCHA MIRANDA", "ROSARIO", 
    "RUA AMARAL COSTA", "RUA AUGUSTO DE VASCONCELOS", "RUA DA ALFANDEGA", "RUA DA PASSAGEM", 
    "RUA DE SANTANA", "RUA DO PRADO", "RUA DO SENADO", "RUA NELSON MANDELA", "SAENS PENA", 
    "SANTA CRUZ", "SAO CRISTOVAO", "SEPETIBA", "SHOPPING BOULEVARD RIO", "SHOPPING CENTER TIJUCA", 
    "SHOPPING DAYS", "SHOPPING VIA BRASIL", "SULACAP", "TELEPORTO", "TINDIBA", "TIRADENTES", 
    "TORRE ALMIRANTE", "URCA", "URUGUAI", "VILA DA PENHA", "VILA ISABEL", "VILA KOSMOS", 
    "VILA VALQUEIRE", "VISTA ALEGRE RIO", "SANTO ANTONIO DE PADUA", "SAO FIDELIS", 
    "SAO FRANCISCO DO ITABAPOANA", "ALCANTARA", "BAIRRO PARAISO", "NOVA CIDADE", 
    "PRACA ZE GAROTO", "RAUL VEIGA", "ROCHA", "SAO GONCALO", "SHOPPING SAO GONCALO", 
    "SAO JOAO DA BARRA", "PRACA DA MATRIZ", "SAO JOAO DE MERITI", "SHOPPING GRANDE RIO", 
    "VILAR DOS TELES", "SAO PEDRO DA ALDEIA", "SAPUCAIA", "SAQUAREMA", "SEROPEDICA", "TANGUA", 
    "AVENIDA FELICIANO SODRE", "TERESOPOLIS", "TRES RIOS", "VILA", "VALENCA", "VASSOURAS", 
    "ATERRADO", "BAIRRO SANTO AGOSTINHO", "CIDADE DO ACO", "RETIRO", "VOLTA REDONDA", 
    "COSTA VERDE, RJ", "TRT CABO FRIO, RJ", "AG EMPRESARIAL NORTE FLUMINENSE", 
    "AGRO CAMPOS DOS GOYTACAZES, RJ", "DIGITAL CAMPOS, RJ", "DIGITAL NORTE FLUMINENSE, RJ", 
    "CASIMIRO DE ABREU, RJ", "AG EMPRESARIAL RIO METROPOLITANA", "DIGITAL BAIXADA FLUMINENSE, RJ", 
    "JARDIM PRIMAVERA, RJ", "ENG PAULO DE FRONTIN, RJ", "AG EMPRESARIAL LESTE FLUMINENSE", 
    "DIGITAL METROPOLITANA, RJ", "DIGITAL NITEROI, RJ", "TRT NITEROI, RJ", 
    "JUSTICA FEDERAL NOVA FRIBURGO, RJ", "AG EMPRESARIAL RIO DE JANEIRO", 
    "AV DOM HELDER CAMARA, RJ", "CLUBE DE REGATAS FLAMENGO, RJ", "CNC, RJ", 
    "CORPORATIVO RIO DE JANEIRO", "DIGITAL BARRA DA TIJUCA, RJ", "DIGITAL CARIOCA, RJ", 
    "DIGITAL GUANABARA, RJ", "DIGITAL HORTO DAS ACACIAS, RJ", "DIGITAL LEBLON, RJ", 
    "DIGITAL MARACANA, RJ", "DIGITAL OESTE CARIOCA, RJ", "DIGITAL PAO DE ACUCAR, RJ", 
    "DIGITAL RIO DE JANEIRO CAPITAL, RJ", "ESTACAO LUCAS, RJ", "FORUM CRIMINAL TRF, RJ", 
    "JUSTICA FEDERAL RIO DE JANEIRO, RJ", "LARGO DO LUME, RJ", "MERCADO SAO SEBASTIAO, RJ", 
    "PALACIO DO EXERCITO, RJ", "PETROBRAS RIO, RJ", "PRIVATE RIO DE JANEIRO", "QUITANDA, RJ", 
    "QUITUNGO, RJ", "ROCINHA, RJ", "RUA DA CANDELARIA, RJ", "RUA DA RELACAO, RJ", 
    "RUA SACADURA CABRAL, RJ", "RUA UBALDINO DO AMARAL, RJ", "SENADOR DANTAS, RJ", 
    "SESC SENAC NACIONAL, RJ", "TIJUCA, RJ", "TRF RIO DE JANEIRO, RJ", 
    "TRT 1A REGIAO RIO DE JANEIRO, RJ", "VOLUNTARIOS DA PATRIA, RJ", "CSN PATIO SOM, RJ", 
    "CSN ZONA LESTE, RJ", "DIGITAL SUL FLUMINENSE, RJ"
  ];

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
  
  const totalGeral = categoryTotals.A + categoryTotals.B + categoryTotals.C;


  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Leitor de Código
            </CardTitle>
            <CardDescription>
              Insira o código inicial e final manually ou usando a câmera.
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
            <div className="space-y-4">
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
                 <div className="space-y-2">
                    <h3 className="font-medium">Relatório</h3>
                    <div className="flex justify-center rounded-lg bg-primary/10 p-4">
                        <div className="text-center">
                            <p className="text-sm text-primary/80">Soma de todas as categorias</p>
                            <p className="text-4xl font-bold text-primary">{totalGeral}</p>
                        </div>
                    </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="agency-select">Agencia</Label>
                    <Select onValueChange={setSelectedAgency} value={selectedAgency || ""}>
                        <SelectTrigger id="agency-select">
                            <SelectValue placeholder="Selecione a agência" />
                        </SelectTrigger>
                        <SelectContent>
                            {agencies.map((agency) => (
                                <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

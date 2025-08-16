
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
    "887 ANGRA DOS REIS", "888 ARARUAMA", "3825 ARMACAO DOS BUZIOS", "177 BARRA DO PIRAI", "3147 03 DE OUTUBRO", 
    "176 BARRA MANSA", "4095 BELFORD ROXO", "4655 ESTRADA MANOEL DE SA", "3390 SARAPUI", "2060 BOM JARDIM", 
    "178 BOM JESUS DO ITABAPOANA", "4437 BAIRRO SAO CRISTOVAO", "179 CABO FRIO", "2061 CACHOEIRAS DE MACACU", 
    "4337 BARAO DE MIRACEMA", "2524 BENTA PEREIRA", "180 CAMPOS", "4120 GUARUS", "3239 PELINCA", 
    "1927 TURFE CLUBE", "970 CANTAGALO", "3174 CORDEIRO", "1334 25 DE AGOSTO", "4118 BRIGADEIRO LIMA E SILVA", 
    "181 DUQUE DE CAXIAS", "2538 GRANDE RIO", "4162 NILO PECANHA", "4881 SANTA CRUZ DA SERRA", 
    "4854 GUAPIMIRIM", "811 ITABORAI", "4376 MANILHA", "909 ITAGUAI", "4642 ITALVA", "1245 ITAOCARA", 
    "182 ITAPERUNA", "4373 PEDRA PRETA", "2810 ITATIAIA", "2131 JAPERI", "3391 CAVALEIROS", "184 MACAE", 
    "4659 PARQUE VALENTINA MIRANDA", "4022 PETROBRAS IMBETIBA", "183 MAGE", "1244 MARICA", 
    "4724 VILA DE SANTA MARIA", "2068 MENDES", "3406 MESQUITA", "992 MIGUEL PEREIRA", "1335 MIRACEMA", 
    "1246 NATIVIDADE", "4145 BEIJA-FLOR", "187 NILOPOLIS", "2249 NILOPOLITANA", "4670 ESTACAO DAS BARCAS", 
    "1337 FONSECA", "175 ICARAI", "4725 INGA", "4448 ITAIPU", "1507 JOSE CLEMENTE", "2180 LARGO DO MARRAO", 
    "2933 MIGUEL DE FRIAS", "174 NITEROI", "3022 PIRATININGA", "1247 SAO FRANCISCO", "3092 SHOPPING BAY MARKET", 
    "4119 CONSELHEIRO PAULINO", "186 NOVA FRIBURGO", "1623 OLARIA", "4755 COMENDADOR SOARES", 
    "3597 ESTACAO NOVA IGUACU", "1620 IGUACUANO", "1619 MARIO GUIMARAES", "185 NOVA IGUACU", 
    "3238 TOP SHOPPING", "1336 PARACAMBI", "925 PARAIBA DO SUL", "2914 PARATY", "4871 PATY DO ALFERES", 
    "2217 ALTO DA SERRA", "1651 IMPERIAL", "4146 ITAIPAVA", "188 PETROPOLIS", "2171 PINHEIRAL", 
    "2077 PIRAI", "656 PORCIUNCULA", "2207 PORTO REAL", "4977 QUATIS", "4097 QUEIMADOS", "4660 QUISSAMA", 
    "2017 CIDADE ALEGRIA", "3551 MANEJO", "189 RESENDE", "769 RIO BONITO", "4403 JARDIM MARILEIA", 
    "2738 RIO DAS OSTRAS", "3241 28 DE SETEMBRO", "231 14 BIS", "1648 AEROPORTO SANTOS DUMONT", 
    "3023 ALMIRANTE GONCALVES", "199 ALMIRANTE TAMANDARE", "2913 AMERICAS", "200 ANCHIETA", "201 ANDARAI", 
    "4648 ANIL", "2954 ARMANDO LOMBARDI", "3131 ATAULFO DE PAIVA", "4748 AV ABELARDO BUENO", "1624 AV CHILE", 
    "207 AV LOBO JUNIOR", "4415 AV MINISTRO ARI FRANCO", "4144 AV RIO BRANCO", "202 BANDEIRA", "203 BANGU", 
    "2904 BARAO DE MESQUITA", "204 BARATA RIBEIRO", "1458 BARRA BUSINESS", "1344 BARRA DA TIJUCA", 
    "205 BONSUCESSO", "206 BOTAFOGO", "4543 CACUIA", "2912 CARDEAL ARCOVERDE", "210 CASCADURA", "1327 CATETE", 
    "3225 CINELANDIA", "216 COCOTA", "1026 CONDE DE BONFIM", "212 COPACABANA", "1037 CURICICA", "213 DEODORO", 
    "2264 DIAS DA CRUZ", "3024 DOWNTOWN", "2030 ENGENHO DE DENTRO", "215 ESTRADA DO GALEAO", 
    "4750 ESTRADA DOS BANDEIRANTES", "4402 ESTRADA DOS TRES RIOS", "4063 FREGUESIA", "208 FREIRE ALEMAO", 
    "1339 GAVEA", "209 GUANABARA", "4946 GUARATIBA", "4062 HADDOCK LOBO", "217 INHANGA", "1095 INHAUMA", 
    "588 IPANEMA", "1024 JACAREPAGUA", "2270 JARDIM BOTANICO", "4147 JARDIM DO MEIER", 
    "4043 JARDIM OCEANICO", "3111 JORNALISTA ROBERTO MARINHO", "2890 JT RIO DE JANEIRO", 
    "211 LARANJEIRAS", "198 LARGO DA CARIOCA", "1776 LARGO DA GLORIA", "990 LARGO DO BICAO", "218 LEBLON", 
    "573 LEME", "3590 LEOPOLDINENSE", "1027 LINO TEIXEIRA", "219 MADUREIRA", "3057 MADUREIRA SHOPPING", 
    "839 MARECHAL MASCARENHAS", "221 MEIER", "4456 MONSENHOR FELIX", "2905 NEW YORK CITY CENTER", 
    "3146 NORTE SHOPPING", "1326 NOSSA SENHORA DA PAZ", "4515 NOVA AMERICA", "4844 NOVO RIO", "4749 OPEN MALL", 
    "3223 PACO IMPERIAL", "222 PALACIO DA FAZENDA", "3637 PARQUE DE MARAPENDI", "1094 PAVUNA", 
    "3105 PECHINCHA", "224 PENHA", "4838 PEQUENA AFRICA", "3093 PEREIRA PASSOS", "225 PILARES", 
    "2915 PIO X", "537 PRACA JAURU", "2956 PRACA MAUA", "1707 PRACA SECA", "3307 PRAIA DE BOTAFOGO", 
    "2387 PRESIDENTE VARGAS", "1025 RAMOS", "680 REALENGO", "4148 RECREIO DOS BANDEIRANTES", 
    "4203 RECREIO SHOPPING", "995 RIACHUELO", "2247 RIO COMPRIDO", "542 RIO DE JANEIRO", "3358 RIO DO A", 
    "1411 RIO NORTE", "4087 RIO OESTE", "545 RIO SUL", "673 ROCHA MIRANDA", "2834 ROSARIO", 
    "2955 RUA AMARAL COSTA", "4945 RUA AUGUSTO DE VASCONCELOS", "2501 RUA DA ALFANDEGA", 
    "3106 RUA DA PASSAGEM", "3613 RUA DE SANTANA", "4944 RUA DO PRADO", "4781 RUA DO SENADO", 
    "1343 RUA NELSON MANDELA", "228 SAENS PENA", "229 SANTA CRUZ", "232 SAO CRISTOVAO", "2376 SEPETIBA", 
    "3187 SHOPPING BOULEVARD RIO", "1650 SHOPPING CENTER TIJUCA", "4553 SHOPPING DAYS", 
    "1330 SHOPPING VIA BRASIL", "4747 SULACAP", "4064 TELEPORTO", "2324 TINDIBA", "3072 TIRADENTES", 
    "3073 TORRE ALMIRANTE", "226 URCA", "4836 URUGUAI", "544 VILA DA PENHA", "233 VILA ISABEL", 
    "4706 VILA KOSMOS", "4086 VILA VALQUEIRE", "4472 VISTA ALEGRE RIO", "191 SANTO ANTONIO DE PADUA", 
    "192 SAO FIDELIS", "1331 SAO FRANCISCO DO ITABAPOANA", "889 ALCANTARA", "4161 BAIRRO PARAISO", 
    "4978 NOVA CIDADE", "4143 PRACA ZE GAROTO", "3594 RAUL VEIGA", "1853 ROCHA", "194 SAO GONCALO", 
    "3028 SHOPPING SAO GONCALO", "3573 SAO JOAO DA BARRA", "4761 PRACA DA MATRIZ", "190 SAO JOAO DE MERITI", 
    "2973 SHOPPING GRANDE RIO", "4149 VILAR DOS TELES", "1243 SAO PEDRO DA ALDEIA", "2072 SAPUCAIA", 
    "1332 SAQUAREMA", "3071 SEROPEDICA", "4872 TANGUA", "4650 AVENIDA FELICIANO SODRE", "193 TERESOPOLIS", 
    "195 TRES RIOS", "1800 VILA", "945 VALENCA", "196 VASSOURAS", "4375 ATERRADO", 
    "2026 BAIRRO SANTO AGOSTINHO", "1504 CIDADE DO ACO", "4018 RETIRO", "197 VOLTA REDONDA", 
    "4377 COSTA VERDE, RJ", "7198 TRT CABO FRIO, RJ", "4273 AG EMPRESARIAL NORTE FLUMINENSE", 
    "7517 AGRO CAMPOS DOS GOYTACAZES, RJ", "5489 DIGITAL CAMPOS, RJ", "3773 DIGITAL NORTE FLUMINENSE, RJ", 
    "4870 CASIMIRO DE ABREU, RJ", "4264 AG EMPRESARIAL RIO METROPOLITANA", "2781 DIGITAL BAIXADA FLUMINENSE, RJ", 
    "2335 JARDIM PRIMAVERA, RJ", "4763 ENG PAULO DE FRONTIN, RJ", "4262 AG EMPRESARIAL LESTE FLUMINENSE", 
    "3820 DIGITAL METROPOLITANA, RJ", "2788 DIGITAL NITEROI, RJ", "2732 TRT NITEROI, RJ", 
    "4014 JUSTICA FEDERAL NOVA FRIBURGO, RJ", "4263 AG EMPRESARIAL RIO DE JANEIRO", 
    "4947 AV DOM HELDER CAMARA, RJ", "7936 CLUBE DE REGATAS FLAMENGO, RJ", "4015 CNC, RJ", 
    "4497 CORPORATIVO RIO DE JANEIRO", "2661 DIGITAL BARRA DA TIJUCA, RJ", "3765 DIGITAL CARIOCA, RJ", 
    "2660 DIGITAL GUANABARA, RJ", "2784 DIGITAL HORTO DAS ACACIAS, RJ", "2662 DIGITAL LEBLON, RJ", 
    "2663 DIGITAL MARACANA, RJ", "2907 DIGITAL OESTE CARIOCA, RJ", "3884 DIGITAL PAO DE ACUCAR, RJ", 
    "3766 DIGITAL RIO DE JANEIRO CAPITAL, RJ", "4948 ESTACAO LUCAS, RJ", "4117 FORUM CRIMINAL TRF, RJ", 
    "625 JUSTICA FEDERAL RIO DE JANEIRO, RJ", "4780 LARGO DO LUME, RJ", "2423 MERCADO SAO SEBASTIAO, RJ", 
    "214 PALACIO DO EXERCITO, RJ", "7947 PETROBRAS RIO, RJ", "4867 PRIVATE RIO DE JANEIRO", "4839 QUITANDA, RJ", 
    "4834 QUITUNGO, RJ", "4193 ROCINHA, RJ", "4775 RUA DA CANDELARIA, RJ", "4840 RUA DA RELACAO, RJ", 
    "3246 RUA SACADURA CABRAL, RJ", "2123 RUA UBALDINO DO AMARAL, RJ", "2809 SENADOR DANTAS, RJ", 
    "2699 SESC SENAC NACIONAL, RJ", "2906 TIJUCA, RJ", "4021 TRF RIO DE JANEIRO, RJ", 
    "4044 TRT 1A REGIAO RIO DE JANEIRO, RJ", "2028 VOLUNTARIOS DA PATRIA, RJ", "4971 CSN PATIO SOM, RJ", 
    "4997 CSN ZONA LESTE, RJ", "3767 DIGITAL SUL FLUMINENSE, RJ"
  ];
  const [isBarcodeApiSupported, setIsBarcodeApiSupported] = useState<boolean>(true);

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('pt-BR'));
  }, []);

  useEffect(() => {
    let detectionInterval: NodeJS.Timeout;
    
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
           if ('BarcodeDetector' in window) {
            const barcodeDetector = new (window as any).BarcodeDetector({
              formats: ['code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code'],
            });

            detectionInterval = setInterval(async () => {
              if (videoRef.current && videoRef.current.readyState === 4) {
                try {
                  const barcodes = await barcodeDetector.detect(videoRef.current);
                  if (barcodes.length > 0) {
                    const scannedCode = barcodes[0].rawValue;
                    handleCapture(scannedCode);
                    clearInterval(detectionInterval);
                  }
                } catch (error) {
                  console.error('Barcode detection failed:', error);
                  // We can toast an error here if needed.
                }
              }
            }, 500);
          } else {
             setIsBarcodeApiSupported(false);
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
    // Cleanup function to stop camera and interval on component unmount or dialog close
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (detectionInterval) {
        clearInterval(detectionInterval);
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

  const handleCapture = (scannedCode: string) => {
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
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 gap-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              CountSKP
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

        {selectedAgency && (
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Relatório Final</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agência</p>
                <p className="font-semibold">{selectedAgency}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <p className="font-semibold">{currentDate}</p>
              </div>
              <Separator />
              <div>
                 <p className="text-sm font-medium text-muted-foreground">Quantidades por Categoria</p>
                 <div className="flex justify-between mt-2">
                    <div className="text-center">
                        <p className="font-bold text-lg">A</p>
                        <p>{categoryTotals.A}</p>
                    </div>
                     <div className="text-center">
                        <p className="font-bold text-lg">B</p>
                        <p>{categoryTotals.B}</p>
                    </div>
                     <div className="text-center">
                        <p className="font-bold text-lg">C</p>
                        <p>{categoryTotals.C}</p>
                    </div>
                 </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Somatório Geral</p>
                <p className="text-2xl font-bold text-primary">{totalGeral}</p>
              </div>
            </CardContent>
          </Card>
        )}
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
            {!isBarcodeApiSupported && (
               <Alert variant="destructive">
                <AlertTitle>Barcode Scanning Not Supported</AlertTitle>
                <AlertDescription>
                  Your browser does not support barcode scanning. Please type the code manually.
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    
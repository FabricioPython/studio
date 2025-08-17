
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
import { Barcode, Moon, Sun, Trash2, Share2, Aperture, Search, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
  } from "@/components/ui/menubar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";


type CategoryTotals = { A: number; B: number; C: number };
type CodePair = {initial: string, final: string};
type CodePairs = { A: CodePair[], B: CodePair[], C: CodePair[] };
type Report = {
    id: string;
    agency: string;
    date: string;
    categoryTotals: CategoryTotals;
    totalGeral: number;
    codePairs: CodePairs;
};

export default function Home() {
  const [initialCode, setInitialCode] = useState("");
  const [finalCode, setFinalCode] = useState("");
  const [rangeResult, setRangeResult] = useState<number | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanningFor, setScanningFor] = useState<"initial" | "final" | "consult" | null>(
    null
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<keyof CategoryTotals | null>(null);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotals>({ A: 0, B: 0, C: 0 });
  const [codePairs, setCodePairs] = useState<CodePairs>({ A: [], B: [], C: [] });
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<Report[]>([]);
  const [isReportsDialogOpen, setIsReportsDialogOpen] = useState(false);
  
  const agencies = ["174 NITEROI", "175 ICARAI", "176 BARRA MANSA", "177 BARRA DO PIRAI", "178 BOM JESUS DO ITABAPOANA", "179 CABO FRIO", "180 CAMPOS", "181 DUQUE DE CAXIAS", "182 ITAPERUNA", "183 MAGE", "184 MACAE", "185 NOVA IGUACU", "186 NOVA FRIBURGO", "187 NILOPOLIS", "188 PETROPOLIS", "189 RESENDE", "190 SAO JOAO DE MERITI", "191 SANTO ANTONIO DE PADUA", "192 SAO FIDELIS", "193 TERESOPOLIS", "194 SAO GONCALO", "195 TRES RIOS", "196 VASSOURAS", "197 VOLTA REDONDA", "198 LARGO DA CARIOCA", "199 ALMIRANTE TAMANDARE", "200 ANCHIETA", "201 ANDARAI", "202 BANDEIRA", "203 BANGU", "204 BARATA RIBEIRO", "205 BONSUCESSO", "206 BOTAFOGO", "207 AV LOBO JUNIOR", "208 FREIRE ALEMAO", "209 GUANABARA", "210 CASCADURA", "211 LARANJEIRAS", "212 COPACABANA", "213 DEODORO", "214 PALACIO DO EXERCITO, RJ", "215 ESTRADA DO GALEAO", "216 COCOTA", "217 INHANGA", "218 LEBLON", "219 MADUREIRA", "221 MEIER", "222 PALACIO DA FAZENDA", "224 PENHA", "225 PILARES", "226 URCA", "228 SAENS PENA", "229 SANTA CRUZ", "231 14 BIS", "232 SAO CRISTOVAO", "233 VILA ISABEL", "537 PRACA JAURU", "542 RIO DE JANEIRO", "544 VILA DA PENHA", "545 RIO SUL", "573 LEME", "588 IPANEMA", "625 JUSTICA FEDERAL RIO DE JANEIRO, RJ", "656 PORCIUNCULA", "673 ROCHA MIRANDA", "680 REALENGO", "769 RIO BONITO", "811 ITABORAI", "839 MARECHAL MASCARENHAS", "887 ANGRA DOS REIS", "888 ARARUAMA", "889 ALCANTARA", "909 ITAGUAI", "925 PARAIBA DO SUL", "945 VALENCA", "970 CANTAGALO", "990 LARGO DO BICAO", "992 MIGUEL PEREIRA", "995 RIACHUELO", "1024 JACAREPAGUA", "1025 RAMOS", "1026 CONDE DE BONFIM", "1027 LINO TEIXEIRA", "1037 CURICICA", "1094 PAVUNA", "1095 INHAUMA", "1243 SAO PEDRO DA ALDEIA", "1244 MARICA", "1245 ITAOCARA", "1246 NATIVIDADE", "1247 SAO FRANCISCO", "1326 NOSSA SENHORA DA PAZ", "1327 CATETE", "1330 SHOPPING VIA BRASIL", "1331 SAO FRANCISCO DO ITABAPOANA", "1332 SAQUAREMA", "1334 25 DE AGOSTO", "1335 MIRACEMA", "1336 PARACAMBI", "1337 FONSECA", "1339 GAVEA", "1343 RUA NELSON MANDELA", "1344 BARRA DA TIJUCA", "1411 RIO NORTE", "1458 BARRA BUSINESS", "1504 CIDADE DO ACO", "1507 JOSE CLEMENTE", "1619 MARIO GUIMARAES", "1620 IGUACUANO", "1623 OLARIA", "1624 AV CHILE", "1648 AEROPORTO SANTOS DUMONT", "1650 SHOPPING CENTER TIJUCA", "1651 IMPERIAL", "1707 PRACA SECA", "1776 LARGO DA GLORIA", "1800 VILA", "1853 ROCHA", "1927 TURFE CLUBE", "2017 CIDADE ALEGRIA", "2026 BAIRRO SANTO AGOSTINHO", "2028 VOLUNTARIOS DA PATRIA, RJ", "2030 ENGENHO DE DENTRO", "2060 BOM JARDIM", "2061 CACHOEIRAS DE MACACU", "2068 MENDES", "2072 SAPUCAIA", "2077 PIRAI", "2123 RUA UBALDINO DO AMARAL, RJ", "2131 JAPERI", "2171 PINHEIRAL", "2180 LARGO DO MARRAO", "2207 PORTO REAL", "2217 ALTO DA SERRA", "2247 RIO COMPRIDO", "2249 NILOPOLITANA", "2264 DIAS DA CRUZ", "2270 JARDIM BOTANICO", "2324 TINDIBA", "2335 JARDIM PRIMAVERA, RJ", "2376 SEPETIBA", "2387 PRESIDENTE VARGAS", "2423 MERCADO SAO SEBASTIAO, RJ", "2501 RUA DA ALFANDEGA", "2524 BENTA PEREIRA", "2538 GRANDE RIO", "2660 DIGITAL GUANABARA, RJ", "2661 DIGITAL BARRA DA TIJUCA, RJ", "2662 DIGITAL LEBLON, RJ", "2663 DIGITAL MARACANA, RJ", "2699 SESC SENAC NACIONAL, RJ", "2732 TRT NITEROI, RJ", "2738 RIO DAS OSTRAS", "2781 DIGITAL BAIXADA FLUMINENSE, RJ", "2784 DIGITAL HORTO DAS ACACIAS, RJ", "2788 DIGITAL NITEROI, RJ", "2809 SENADOR DANTAS, RJ", "2810 ITATIAIA", "2834 ROSARIO", "2890 JT RIO DE JANEIRO", "2904 BARAO DE MESQUITA", "2905 NEW YORK CITY CENTER", "2906 TIJUCA, RJ", "2907 DIGITAL OESTE CARIOCA, RJ", "2912 CARDEAL ARCOVERDE", "2913 AMERICAS", "2914 PARATY", "2915 PIO X", "2933 MIGUEL DE FRIAS", "2954 ARMANDO LOMBARDI", "2955 RUA AMARAL COSTA", "2956 PRACA MAUA", "2973 SHOPPING GRANDE RIO", "3022 PIRATININGA", "3023 ALMIRANTE GONCALVES", "3024 DOWNTOWN", "3028 SHOPPING SAO GONCALO", "3057 MADUREIRA SHOPPING", "3071 SEROPEDICA", "3072 TIRADENTES", "3073 TORRE ALMIRANTE", "3092 SHOPPING BAY MARKET", "3093 PEREIRA PASSOS", "3105 PECHINCHA", "3106 RUA DA PASSAGEM", "3111 JORNALISTA ROBERTO MARINHO", "3131 ATAULFO DE PAIVA", "3146 NORTE SHOPPING", "3147 03 DE OUTUBRO", "3174 CORDEIRO", "3187 SHOPPING BOULEVARD RIO", "3223 PACO IMPERIAL", "3225 CINELANDIA", "3238 TOP SHOPPING", "3239 PELINCA", "3241 28 DE SETEMBRO", "3246 RUA SACADURA CABRAL, RJ", "3307 PRAIA DE BOTAFOGO", "3358 RIO DO A", "3390 SARAPUI", "3391 CAVALEIROS", "3406 MESQUITA", "3551 MANEJO", "3573 SAO JOAO DA BARRA", "3590 LEOPOLDINENSE", "3594 RAUL VEIGA", "3597 ESTACAO NOVA IGUACU", "3613 RUA DE SANTANA", "3637 PARQUE DE MARAPENDI", "3765 DIGITAL CARIOCA, RJ", "3766 DIGITAL RIO DE JANEIRO CAPITAL, RJ", "3767 DIGITAL SUL FLUMINENSE, RJ", "3773 DIGITAL NORTE FLUMINENSE, RJ", "3820 DIGITAL METROPOLITANA, RJ", "3825 ARMACAO DOS BUZIOS", "3884 DIGITAL PAO DE ACUCAR, RJ", "4014 JUSTICA FEDERAL NOVA FRIBURGO, RJ", "4015 CNC, RJ", "4018 RETIRO", "4021 TRF RIO DE JANEIRO, RJ", "4022 PETROBRAS IMBETIBA", "4043 JARDIM OCEANICO", "4044 TRT 1A REGIAO RIO DE JANEIRO, RJ", "4062 HADDOCK LOBO", "4063 FREGUESIA", "4064 TELEPORTO", "4086 VILA VALQUEIRE", "4087 RIO OESTE", "4095 BELFORD ROXO", "4097 QUEIMADOS", "4117 FORUM CRIMINAL TRF, RJ", "4118 BRIGADEIRO LIMA E SILVA", "4119 CONSELHEIRO PAULINO", "4120 GUARUS", "4143 PRACA ZE GAROTO", "4144 AV RIO BRANCO", "4145 BEIJA-FLOR", "4146 ITAIPAVA", "4147 JARDIM DO MEIER", "4148 RECREIO DOS BANDEIRANTES", "4149 VILAR DOS TELES", "4161 BAIRRO PARAISO", "4162 NILO PECANHA", "4193 ROCINHA, RJ", "4203 RECREIO SHOPPING", "4262 AG EMPRESARIAL LESTE FLUMINENSE", "4263 AG EMPRESARIAL RIO DE JANEIRO", "4264 AG EMPRESARIAL RIO METROPOLITANA", "4273 AG EMPRESARIAL NORTE FLUMINENSE", "4337 BARAO DE MIRACEMA", "4373 PEDRA PRETA", "4375 ATERRADO", "4376 MANILHA", "4377 COSTA VERDE, RJ", "4402 ESTRADA DOS TRES RIOS", "4403 JARDIM MARILEIA", "4415 AV MINISTRO ARI FRANCO", "4437 BAIRRO SAO CRISTOVAO", "4448 ITAIPU", "4456 MONSENHOR FELIX", "4472 VISTA ALEGRE RIO", "4497 CORPORATIVO RIO DE JANEIRO", "4515 NOVA AMERICA", "4543 CACUIA", "4553 SHOPPING DAYS", "4642 ITALVA", "4648 ANIL", "4650 AVENIDA FELICIANO SODRE", "4655 ESTRADA MANOEL DE SA", "4659 PARQUE VALENTINA MIRANDA", "4660 QUISSAMA", "4670 ESTACAO DAS BARCAS", "4706 VILA KOSMOS", "4724 VILA DE SANTA MARIA", "4725 INGA", "4747 SULACAP", "4748 AV ABELARDO BUENO", "4749 OPEN MALL", "4750 ESTRADA DOS BANDEIRantes", "4755 COMENDADOR SOARES", "4761 PRACA DA MATRIZ", "4763 ENG PAULO DE FRONTIN, RJ", "4775 RUA DA CANDELARIA, RJ", "4780 LARGO DO LUME, RJ", "4781 RUA DO SENADO", "4834 QUITUNGO, RJ", "4836 URUGUAI", "4838 PEQUENA AFRICA", "4839 QUITANDA, RJ", "4840 RUA DA RELACAO, RJ", "4844 NOVO RIO", "4854 GUAPIMIRIM", "4867 PRIVATE RIO DE JANEIRO", "4870 CASIMIRO DE ABREU, RJ", "4871 PATY DO ALFERES", "4872 TANGUA", "4881 SANTA CRUZ DA SERRA", "4944 RUA DO PRADO", "4945 RUA AUGUSTO DE VASCONCELOS", "4946 GUARATIBA", "4947 AV DOM HELDER CAMARA, RJ", "4948 ESTACAO LUCAS, RJ", "4971 CSN PATIO SOM, RJ", "4977 QUATIS", "4978 NOVA CIDADE", "4997 CSN ZONA LESTE, RJ", "5489 DIGITAL CAMPOS, RJ", "7198 TRT CABO FRIO, RJ", "7517 AGRO CAMPOS DOS GOYTACAZES, RJ", "7936 CLUBE DE REGATAS FLAMENGO, RJ", "7947 PETROBRAS RIO, RJ"];
  const [isBarcodeApiSupported, setIsBarcodeApiSupported] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState('');
  const [theme, setTheme] = useState("light");
  const [isConsultDialogOpen, setIsConsultDialogOpen] = useState(false);
  const [consultSelectedReportId, setConsultSelectedReportId] = useState<string | null>(null);
  const [skpToSearch, setSkpToSearch] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isReservaFacilDialogOpen, setIsReservaFacilDialogOpen] = useState(false);
  const [reservaFacilSelectedReportId, setReservaFacilSelectedReportId] = useState<string | null>(null);


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('pt-BR'));
    const storedReports = localStorage.getItem('savedReports');
    if (storedReports) {
        setSavedReports(JSON.parse(storedReports));
    }
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

  const handleScan = (field: "initial" | "final" | "consult") => {
    setScanningFor(field);
    setIsCameraOpen(true);
    if (field !== 'consult') {
        setRangeResult(null);
    }
  };

  const handleProcess = () => {
    const isNumeric = /^\d{10}$/;
    if (!isNumeric.test(initialCode) || !isNumeric.test(finalCode)) {
      toast({
        variant: "destructive",
        title: "Códigos Inválidos",
        description: "O código inicial e final devem conter exatamente 10 dígitos numéricos.",
      });
      setRangeResult(null);
      return;
    }

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
    let processedCode = scannedCode;
    if (processedCode.toUpperCase().startsWith('T')) {
      processedCode = processedCode.substring(1);
    }
    
    if (scanningFor === "initial") {
      setInitialCode(processedCode);
    } else if (scanningFor === "final") {
      setFinalCode(processedCode);
    } else if (scanningFor === "consult") {
        setSkpToSearch(processedCode);
    }
    setIsCameraOpen(false);
    toast({
      title: "Código Escaneado",
      description: `Código ${processedCode} capturado para o campo ${scanningFor}.`,
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
        [selectedCategory]: prevTotals[selectedCategory] + rangeResult
    }));

    setCodePairs(prevPairs => ({
        ...prevPairs,
        [selectedCategory]: [...prevPairs[selectedCategory], { initial: initialCode, final: finalCode }]
    }));


    setInitialCode("");
    setFinalCode("");
    setRangeResult(null);
    setSelectedCategory(null);

    toast({
        title: "Contagem Salva",
        description: `${rangeResult} SKPs adicionados ao tipo ${selectedCategory}.`,
    })

  }
  
  const totalGeral = categoryTotals.A + categoryTotals.B + categoryTotals.C;

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSaveReport = () => {
    if (!selectedAgency) {
      toast({
        variant: "destructive",
        title: "Agência não selecionada",
        description: "Por favor, selecione uma agência para salvar o relatório.",
      });
      return;
    }

    const newReport: Report = {
      id: new Date().toISOString(),
      agency: selectedAgency,
      date: currentDate,
      categoryTotals,
      totalGeral,
      codePairs,
    };

    const updatedReports = [...savedReports, newReport];
    setSavedReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));

    toast({
      title: "Relatório Salvo",
      description: `Relatório para ${selectedAgency} foi salvo com sucesso.`,
    });

    // Reset fields
    setCategoryTotals({ A: 0, B: 0, C: 0 });
    setCodePairs({ A: [], B: [], C: [] });
    setSelectedAgency(null);
    setInitialCode("");
    setFinalCode("");
    setRangeResult(null);
    setSelectedCategory(null);
  };

  const clearAllReports = () => {
    setSavedReports([]);
    localStorage.removeItem('savedReports');
    toast({
        title: "Relatórios Excluídos",
        description: "Todos os relatórios salvos foram excluídos.",
    });
  }

  const generateNewReport = () => {
    setCategoryTotals({ A: 0, B: 0, C: 0 });
    setCodePairs({ A: [], B: [], C: [] });
    setSelectedAgency(null);
    setInitialCode("");
    setFinalCode("");
    setRangeResult(null);
    setSelectedCategory(null);
    toast({
        title: "Novo Relatório",
        description: "Campos limpos para um novo relatório.",
    });
  }

  const handleShare = async (elementId: string, isCurrentReport = false) => {
    const reportElement = document.getElementById(elementId);
    if (!reportElement) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível encontrar o relatório para compartilhar.",
      });
      return;
    }

    const saveButton = isCurrentReport ? reportElement.querySelector<HTMLElement>('.save-report-button') : null;

    if (saveButton) {
      saveButton.style.display = 'none';
    }

    try {
      const canvas = await html2canvas(reportElement, {
        useCORS: true,
        scale: 2, 
        backgroundColor: theme === 'dark' ? '#134074' : '#eef4ed',
      });
      
      if (saveButton) {
        saveButton.style.display = 'block';
      }

      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "relatorio.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Relatório de SKPs',
          text: `Segue o relatório de SKPs.`,
        });
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'relatorio.png';
        link.click();
        toast({
            title: "Imagem Salva",
            description: "A imagem do relatório foi baixada. Você pode compartilhá-la manualmente.",
        })
      }
    } catch (error) {
      if (saveButton) {
        saveButton.style.display = 'block';
      }
      console.error("Error generating or sharing image:", error);
      toast({
        variant: "destructive",
        title: "Erro ao compartilhar",
        description: "Não foi possível gerar ou compartilhar a imagem do relatório.",
      });
    }
  };

  const handleConsultSKP = () => {
    if (!consultSelectedReportId || !skpToSearch) {
      toast({
        variant: "destructive",
        title: "Informação Incompleta",
        description: "Por favor, selecione um relatório e insira um SKP para consultar.",
      });
      return;
    }
  
    const report = savedReports.find(r => r.id === consultSelectedReportId);
    if (!report) return;
  
    const skpNum = parseInt(skpToSearch, 10);
    if (isNaN(skpNum)) {
      setSearchResult("SKP inválido. Insira apenas números.");
      return;
    }
  
    const allPairs = [...report.codePairs.A, ...report.codePairs.B, ...report.codePairs.C];
  
    for (const pair of allPairs) {
      const initial = parseInt(pair.initial, 10);
      const final = parseInt(pair.final, 10);
      if (skpNum >= initial && skpNum <= final) {
        setSearchResult(`Encontrado na sequência: ${pair.initial} - ${pair.final}`);
        return;
      }
    }
  
    setSearchResult("SKP não encontrado neste relatório.");
  };

  const openConsultDialog = () => {
    setConsultSelectedReportId(null);
    setSkpToSearch("");
    setSearchResult(null);
    setIsConsultDialogOpen(true);
  }

  const openReservaFacilDialog = () => {
    setReservaFacilSelectedReportId(null);
    setIsReservaFacilDialogOpen(true);
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        toast({
            title: "Copiado!",
            description: "Sequência copiada para a área de transferência."
        })
    }).catch(err => {
        console.error("Failed to copy text: ", err);
        toast({
            variant: "destructive",
            title: "Erro ao copiar",
            description: "Não foi possível copiar a sequência."
        })
    })
  }

  const selectedReservaFacilReport = savedReports.find(r => r.id === reservaFacilSelectedReportId);
  const allCodePairsFromSelectedReport = selectedReservaFacilReport
    ? [...selectedReservaFacilReport.codePairs.A, ...selectedReservaFacilReport.codePairs.B, ...selectedReservaFacilReport.codePairs.C]
    : [];


  return (
    <>
      <div className="flex flex-col min-h-screen w-full bg-background">
        <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
            <MenubarMenu>
                <MenubarTrigger>Relatórios</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={generateNewReport}>Gerar Novo Relatório</MenubarItem>
                    <MenubarItem onClick={() => setIsReportsDialogOpen(true)}>Ver Relatórios Salvos</MenubarItem>
                    <MenubarItem onClick={openConsultDialog}>Consultar SKP</MenubarItem>
                    <MenubarItem onClick={openReservaFacilDialog}>Reserva Fácil</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={handleThemeChange}>Alternar Tema</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
        <main className="flex flex-1 w-full flex-col items-center justify-center p-4 gap-4">
            <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                    CountSKP
                    </CardTitle>
                    <CardDescription>
                    Insira o código inicial e final manual ou usando a câmera.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    <Switch
                        checked={theme === "dark"}
                        onCheckedChange={handleThemeChange}
                        aria-label="Toggle dark mode"
                    />
                    <Moon className="h-5 w-5" />
                </div>
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
                    maxLength={10}
                    />
                    <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleScan("initial")}
                    aria-label="Escanear código inicial"
                    >
                    <Barcode className="h-5 w-5" />
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
                    maxLength={10}
                    />
                    <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleScan("final")}
                    aria-label="Escanear código final"
                    >
                    <Barcode className="h-5 w-5" />
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
                        <Label>Selecione o Tipo</Label>
                        <RadioGroup 
                            className="flex items-center gap-4" 
                            value={selectedCategory || ""}
                            onValueChange={(value) => setSelectedCategory(value as keyof CategoryTotals)}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="A" id="cat-a" />
                                <Label htmlFor="cat-a">Tipo A</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="B" id="cat-b" />
                                <Label htmlFor="cat-b">Tipo B</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="C" id="cat-c" />
                                <Label htmlFor="cat-c">Tipo C</Label>
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
                        <h3 className="font-medium">Totais por Tipo</h3>
                        <div className="flex justify-between rounded-lg bg-muted p-3">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Tipo A</p>
                                <p className="text-2xl font-bold">{categoryTotals.A}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Tipo B</p>
                                <p className="text-2xl font-bold">{categoryTotals.B}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Tipo C</p>
                                <p className="text-2xl font-bold">{categoryTotals.C}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-medium">Relatório</h3>
                        <div className="flex justify-center rounded-lg bg-primary/10 p-4">
                            <div className="text-center">
                                <p className="text-sm text-primary/80">Soma de todos os tipos</p>
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
            </Card>

            {selectedAgency && (
            <Card className="w-full max-w-md shadow-lg" id="current-report-card">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Relatório Final</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleShare('current-report-card', true)}>
                        <Share2 className="h-4 w-4" />
                    </Button>
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
                    <p className="text-sm font-medium text-muted-foreground">Quantidades por Tipo</p>
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
                <CardFooter>
                  <Button className="w-full save-report-button" onClick={handleSaveReport}>Salvar</Button>
                </CardFooter>
            </Card>
            )}
        </main>
      </div>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
          </DialogHeader>
          <div className="relative grid gap-4 py-4">
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
                  Your browser does not support the Barcode Detection API. Please type the code manually.
                </AlertDescription>
              </Alert>
            )}
             <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline/>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80%] h-[50%] border-4 border-white/80 rounded-lg shadow-lg" />
             </div>
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
      
      <Dialog open={isReportsDialogOpen} onOpenChange={setIsReportsDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Relatórios Salvos</DialogTitle>
                <DialogDescription>
                    Aqui estão todos os relatórios que você salvou.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-4">
                {savedReports.length > 0 ? (
                <div className="space-y-4">
                    {savedReports.map((report) => (
                    <Card key={report.id} id={`report-card-${report.id}`}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{report.agency}</span>
                                <div className="flex items-center gap-2">
                                <Badge variant="secondary">{report.date}</Badge>
                                <Button variant="ghost" size="icon" onClick={() => handleShare(`report-card-${report.id}`)}>
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Pares de Códigos</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">A</TableCell>
                                        <TableCell>{report.categoryTotals.A}</TableCell>
                                        <TableCell className="text-xs">
                                            {report.codePairs.A.map(p => `${p.initial} - ${p.final}`).join(', ')}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">B</TableCell>
                                        <TableCell>{report.categoryTotals.B}</TableCell>
                                        <TableCell className="text-xs">
                                             {report.codePairs.B.map(p => `${p.initial} - ${p.final}`).join(', ')}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">C</TableCell>
                                        <TableCell>{report.categoryTotals.C}</TableCell>
                                        <TableCell className="text-xs">
                                             {report.codePairs.C.map(p => `${p.initial} - ${p.final}`).join(', ')}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell>Total Geral</TableCell>
                                        <TableCell colSpan={2}>{report.totalGeral}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                ) : (
                <p className="text-muted-foreground text-center py-8">Nenhum relatório salvo ainda.</p>
                )}
            </div>
            <DialogFooter className="mt-4 gap-2 sm:justify-between">
                {savedReports.length > 0 && (
                    <Button variant="destructive" onClick={clearAllReports}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Todos
                    </Button>
                )}
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Fechar
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConsultDialogOpen} onOpenChange={setIsConsultDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
                <DialogTitle>Consultar SKP</DialogTitle>
                <DialogDescription>
                    Selecione um relatório e insira um SKP para verificar se ele pertence a alguma sequência salva.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="consult-report-select">Relatório</Label>
                    <Select onValueChange={(value) => {setConsultSelectedReportId(value); setSearchResult(null);}} value={consultSelectedReportId || ""}>
                        <SelectTrigger id="consult-report-select">
                            <SelectValue placeholder="Selecione um relatório salvo" />
                        </SelectTrigger>
                        <SelectContent>
                            {savedReports.length > 0 ? (
                                savedReports.map((report) => (
                                    <SelectItem key={report.id} value={report.id}>{report.agency} - {report.date}</SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-reports" disabled>Nenhum relatório salvo</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="consult-skp-input">Código SKP</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="consult-skp-input"
                            type="text"
                            inputMode="numeric"
                            placeholder="Digite ou escaneie o código"
                            className="flex-1"
                            value={skpToSearch}
                            onChange={(e) => {
                                setSkpToSearch(e.target.value);
                                setSearchResult(null);
                            }}
                            disabled={!consultSelectedReportId}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleScan("consult")}
                            aria-label="Escanear código SKP"
                            disabled={!consultSelectedReportId}
                        >
                            <Barcode className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <Button onClick={handleConsultSKP} disabled={!consultSelectedReportId || !skpToSearch}>
                    <Search className="mr-2 h-4 w-4" />
                    Consultar
                </Button>
                {searchResult && (
                    <Alert variant={searchResult.startsWith("Encontrado") ? "default" : "destructive"} className="mt-4">
                        <AlertTitle>{searchResult.startsWith("Encontrado") ? "Resultado da Consulta" : "Não Encontrado"}</AlertTitle>
                        <AlertDescription>
                           {searchResult}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Fechar
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReservaFacilDialogOpen} onOpenChange={setIsReservaFacilDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Reserva Fácil</DialogTitle>
                <DialogDescription>
                    Selecione um relatório para ver as sequências e copiá-las facilmente.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                    <Label htmlFor="reserva-report-select">Relatório</Label>
                    <Select onValueChange={setReservaFacilSelectedReportId} value={reservaFacilSelectedReportId || ""}>
                        <SelectTrigger id="reserva-report-select">
                            <SelectValue placeholder="Selecione um relatório salvo" />
                        </SelectTrigger>
                        <SelectContent>
                            {savedReports.length > 0 ? (
                                savedReports.map((report) => (
                                    <SelectItem key={report.id} value={report.id}>{report.agency} - {report.date}</SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-reports" disabled>Nenhum relatório salvo</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 -mr-4">
              {selectedReservaFacilReport ? (
                 <div className="space-y-4">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sequência</TableHead>
                                <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allCodePairsFromSelectedReport.length > 0 ? allCodePairsFromSelectedReport.map((pair, index) => {
                                const sequenceText = `${pair.initial} - ${pair.final}`;
                                return (
                                <TableRow key={index}>
                                    <TableCell className="font-mono">{sequenceText}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(sequenceText)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                )
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                                        Nenhuma sequência neste relatório.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Selecione um relatório para começar.</p>
              )}
            </div>
            
            <DialogFooter className="mt-4">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Fechar
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

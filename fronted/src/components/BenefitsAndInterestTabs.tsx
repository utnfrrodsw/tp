import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


const BenefitsAndInterestTabs = () => {
  return (
    <Tabs defaultValue="beneficio" className="mb-6">
      <TabsList>
        <TabsTrigger value="beneficio">Beneficio</TabsTrigger>
        <TabsTrigger value="interes">Interés</TabsTrigger>
      </TabsList>
      <TabsContent value="beneficio">
        {/* Aquí va el contenido de la sección Beneficio */}
        <div>Contenido de Beneficio</div>
      </TabsContent>
      <TabsContent value="interes">
        {/* Aquí va el contenido de la sección Interés */}
        <div>Contenido de Interés</div>
      </TabsContent>
    </Tabs>
  );
};

export default BenefitsAndInterestTabs;

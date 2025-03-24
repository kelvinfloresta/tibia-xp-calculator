import { Link } from "@/i18n/routing";
import { Text } from "@radix-ui/themes";

export default function Home() {
  // const t = useTranslations("HomePage");

  return (
    <>
      <Text as="p">
        <Link href="/xp-comparator">Visão geral:</Link>
      </Text>
      <Text as="p">
        Normalmente sempre compensa caçar em time para obter o máximo de
        experiência, mas nem sempre é possível encontrar um time. Existem outros
        motivos que atrapalham a sua hunt como:{" "}
        <Text>atrasos, faltas e locais já ocupados por outros jogadores</Text>.
      </Text>

      <Text as="p">Solução:</Text>
      <Text as="p">
        Criei esta ferramenta para me ajudar (e a comunidade) a calcular{" "}
        <Text>
          quanto tempo a mais devo caçar para compensar e obter os mesmos
          resultado
        </Text>
      </Text>

      <Text as="p">Novidades:</Text>
      <Text as="p">
        Em breve trarei mais funcionalidades que utilizo e análises para
        melhorar a eficiência do personagem
      </Text>
    </>
  );
}

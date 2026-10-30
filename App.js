import React, { useMemo, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Image, ImageBackground, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Speech from "expo-speech";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";

const PINK = "#F45BA5";
const letters = ["A","B","C","Ç","D","E","F","G","Ğ","H","I","İ","J","K","L","M","N","O","Ö","P","R","S","Ş","T","U","Ü","V","Y","Z"];
const shapes = [{name:"Daire",symbol:"●",color:"#F45B69"},{name:"Kare",symbol:"■",color:"#4285F4"},{name:"Üçgen",symbol:"▲",color:"#FFB52E"},{name:"Dikdörtgen",symbol:"▰",color:"#36B879"},{name:"Yıldız",symbol:"★",color:"#A56BE8"},{name:"Kalp",symbol:"♥",color:"#F45BA5"}];
const colors = [{name:"Kırmızı",color:"#F04452"},{name:"Mavi",color:"#3987F5"},{name:"Sarı",color:"#FFC928"},{name:"Yeşil",color:"#36B879"},{name:"Mor",color:"#9B68D7"},{name:"Pembe",color:"#F45BA5"},{name:"Turuncu",color:"#FF8A35"}];

export default function App() {
  const [section,setSection] = useState("home");
  const [index,setIndex] = useState(0);
  const [path,setPath] = useState("");
  const [points,setPoints] = useState(0);
  const [stars,setStars] = useState(0);
  const [done,setDone] = useState(false);
  const [drawCount,setDrawCount] = useState(0);
  const area = useRef({w:300,h:300});
  const currentLetter = letters[index % letters.length];

  const say = (message) => Speech.speak(message,{language:"tr-TR",rate:0.88,pitch:1.12});
  const start = (s) => { setSection(s); setIndex(0); setPath(""); setDone(false); if(s==="letters") say("Haydi harfleri öğrenelim! Parmağını çizginin üzerinden yavaşça geçir."); };
  const reset = () => { setPath(""); setDone(false); };
  const onTouchStart = (e) => {
    const {locationX:x,locationY:y} = e.nativeEvent;
    setPath(`M ${x} ${y}`);
    setDone(false);
  };
  const onTouchMove = (e) => {
    const {locationX:x,locationY:y} = e.nativeEvent;
    setPath(p => p ? `${p} L ${x} ${y}` : `M ${x} ${y}`);
  };
  const onTouchEnd = () => {
    setDrawCount(n=>n+1);
    // A short trace earns encouragement; the child can retry without penalty.
    setStars(n=>n+1);
    setDone(true);
    say("Harika! Çok güzel denedin. Bir yıldız kazandın!");
  };
  const next = () => {
    setIndex(i=>i+1);
    setPath("");
    setDone(false);
    if(section==="letters") say(`Sıradaki harf. ${letters[(index+1)%letters.length]}. Haydi birlikte çizelim!`);
  };

  const Header = ({title}) => <View style={styles.header}><Pressable onPress={()=>setSection("home")}><Text style={styles.back}>‹</Text></Pressable><Text style={styles.headerTitle}>{title}</Text><Text style={styles.star}>⭐ {stars}</Text></View>;
  const MenuButton = ({emoji,title,color,onPress}) => <Pressable onPress={onPress} style={[styles.menuButton,{backgroundColor:color}]}><Text style={styles.menuEmoji}>{emoji}</Text><Text style={styles.menuText}>{title}</Text><Text style={styles.chev}>›</Text></Pressable>;

  return <View style={styles.container}>
    <StatusBar style="dark"/>
    {section==="home" ? <View style={styles.homeScreen}>
      <ImageBackground source={require("./assets/home.png")} resizeMode="stretch" style={styles.homeArtwork}>
        <Pressable accessibilityLabel="Mira'yı dinle" onPress={()=>say("Merhaba! Ben Mira. Haydi birlikte öğrenelim!")} style={[styles.hotspot,{top:"27%",left:"7%",width:"86%",height:"11%"}]}/>
        <Pressable accessibilityLabel="Harfleri öğrenelim" onPress={()=>start("letters")} style={[styles.hotspot,{top:"39%",left:"4%",width:"92%",height:"15%"}]}/>
        <Pressable accessibilityLabel="Sayıları öğrenelim" onPress={()=>start("numbers")} style={[styles.hotspot,{top:"55%",left:"4%",width:"92%",height:"15%"}]}/>
        <Pressable accessibilityLabel="Şekilleri öğrenelim" onPress={()=>start("shapes")} style={[styles.hotspot,{top:"71%",left:"4%",width:"92%",height:"15%"}]}/>
        <Pressable accessibilityLabel="Başarılarım" onPress={()=>say(`Harika! ${stars} yıldız kazandın.`)} style={[styles.hotspot,{top:"88%",left:"3%",width:"30%",height:"10%"}]}/>
        <Pressable accessibilityLabel="Ayarlar" onPress={()=>say("Ayarlar bölümü yakında.")} style={[styles.hotspot,{top:"88%",left:"35%",width:"30%",height:"10%"}]}/>
      </ImageBackground>
    </View> : <View style={{flex:1}}>
      <Header title={section==="letters"?"Harfler":section==="numbers"?"Sayılar":section==="shapes"?"Şekiller":"Renkler"}/>
      {section==="letters" || section==="numbers" ? <>
        <Text style={styles.instruction}>{section==="letters" ? `Mira diyor ki: ${currentLetter} harfini parmağınla çiz!` : `Mira diyor ki: ${index+1} sayısını tanıyalım!`}</Text>
        <Pressable onPress={()=>say(section==="letters"?`${currentLetter} harfi. Haydi ${currentLetter} harfini çiz!`:`Bu ${index+1} sayısı. Haydi birlikte sayalım!`)} style={styles.listen}><Text style={styles.listenText}>🔊 Mira'yı dinle</Text></Pressable>
        <View style={styles.drawArea} onLayout={e=>area.current={w:e.nativeEvent.layout.width,h:e.nativeEvent.layout.height}} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <Svg width="100%" height="100%" viewBox="0 0 300 300">
            <SvgText x="150" y="218" fontSize="205" fontWeight="bold" textAnchor="middle" fill="#FCE2EF" stroke="#E7A4C5" strokeWidth="1.5">{section==="letters"?currentLetter:String((index%20)+1)}</SvgText>
            {path ? <Path d={path} stroke="#F0449A" strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round"/> : null}
          </Svg>
          <Text style={styles.traceHint}>Parmağını burada gezdir 👆</Text>
        </View>
        {done ? <Text style={styles.success}>🌟 Harikasın! Bir yıldız kazandın!</Text> : <Text style={styles.tip}>Soluk harfin üzerinden geçmeyi dene.</Text>}
        <View style={styles.actions}><Pressable style={styles.retry} onPress={reset}><Text style={styles.actionText}>↻ Tekrar çiz</Text></Pressable><Pressable style={styles.next} onPress={next}><Text style={styles.actionText}>Sonraki ➜</Text></Pressable></View>
      </> : section==="shapes" ? <ScrollView contentContainerStyle={styles.gridPage}><Text style={styles.instruction}>Mira ile şekilleri tanıyalım!</Text>{shapes.map((s,i)=><Pressable key={s.name} style={styles.tile} onPress={()=>{setIndex(i);say(`${s.name}. Bu bir ${s.name.toLocaleLowerCase("tr-TR")}.`);}}><Text style={{fontSize:58,color:s.color}}>{s.symbol}</Text><Text style={styles.tileName}>{s.name}</Text><Text>🔊 Dinle</Text></Pressable>)}</ScrollView> : <ScrollView contentContainerStyle={styles.gridPage}><Text style={styles.instruction}>Mira ile renkleri tanıyalım!</Text>{colors.map(c=><Pressable key={c.name} style={styles.tile} onPress={()=>say(`Bu renk ${c.name.toLocaleLowerCase("tr-TR")}.`)}><View style={[styles.colorDot,{backgroundColor:c.color}]}/><Text style={styles.tileName}>{c.name}</Text><Text>🔊 Dinle</Text></Pressable>)}</ScrollView>}
    </View>}
  </View>;
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#FFF7FB"},
  home:{flex:1},\n  homeScreen:{flex:1,backgroundColor:"#FFF4FA"},\n  homeArtwork:{flex:1,width:"100%",height:"100%"},\n  hotspot:{position:"absolute",backgroundColor:"transparent"},
  brand:{fontSize:34,fontWeight:"900",color:"#D83F91",textAlign:"center",marginBottom:18,lineHeight:40},
  miraCard:{backgroundColor:"#FFE3F0",borderRadius:24,padding:16,flexDirection:"row",alignItems:"center",marginBottom:24,borderWidth:2,borderColor:"#FFC3DE"},
  miraPortrait:{width:104,height:124,borderRadius:18,marginRight:12,backgroundColor:"#FFD6E8"},
  miraTitle:{fontSize:24,fontWeight:"900",color:"#B72B79"},
  miraText:{fontSize:16,color:"#673B55",marginTop:4},
  speak:{fontSize:15,fontWeight:"800",color:"#A92770",marginTop:10},
  subtitle:{fontSize:19,fontWeight:"800",color:"#4B3850",marginBottom:12},
  menuButton:{borderRadius:20,padding:16,marginBottom:12,flexDirection:"row",alignItems:"center",elevation:2},
  menuEmoji:{fontSize:32,marginRight:14},
  menuText:{fontSize:18,fontWeight:"900",color:"white",flex:1},
  chev:{fontSize:32,color:"white",fontWeight:"900"},
  footer:{marginTop:10,alignItems:"center"},
  footerText:{fontSize:17,fontWeight:"800",color:"#9D4C7A"},
  header:{height:62,flexDirection:"row",alignItems:"center",paddingHorizontal:18,justifyContent:"space-between"},
  back:{fontSize:40,color:"#C43A83"},
  headerTitle:{fontSize:21,fontWeight:"900",color:"#A52C70"},
  star:{fontSize:17,fontWeight:"900",color:"#9D6A12"},
  instruction:{fontSize:18,fontWeight:"800",color:"#604052",textAlign:"center",paddingHorizontal:18,marginTop:14,marginBottom:10},
  listen:{alignSelf:"center",backgroundColor:"#FFE0EF",paddingVertical:10,paddingHorizontal:20,borderRadius:18,marginBottom:12},
  listenText:{fontWeight:"900",color:"#B72B79",fontSize:16},
  drawArea:{height:330,marginHorizontal:18,backgroundColor:"white",borderRadius:24,borderWidth:2,borderColor:"#F4C5DC",overflow:"hidden"},
  traceHint:{position:"absolute",bottom:9,alignSelf:"center",color:"#B987A3",fontWeight:"700"},
  success:{textAlign:"center",fontSize:18,fontWeight:"900",color:"#269B63",marginTop:12},
  tip:{textAlign:"center",fontSize:15,color:"#967A89",marginTop:12},
  actions:{flexDirection:"row",justifyContent:"center",gap:12,marginTop:16},
  retry:{backgroundColor:"#E9DDF4",padding:14,borderRadius:16},
  next:{backgroundColor:"#F45BA5",padding:14,borderRadius:16},
  actionText:{color:"white",fontWeight:"900",fontSize:16},
  gridPage:{padding:18,flexDirection:"row",flexWrap:"wrap",justifyContent:"center",gap:12},
  tile:{width:"44%",minHeight:145,backgroundColor:"white",borderRadius:20,alignItems:"center",justifyContent:"center",padding:12,borderWidth:1,borderColor:"#F2D7E5"},
  tileName:{fontSize:18,fontWeight:"900",color:"#69475B",marginVertical:6},
  colorDot:{width:62,height:62,borderRadius:40,borderWidth:3,borderColor:"#FFFFFF",elevation:2}
});

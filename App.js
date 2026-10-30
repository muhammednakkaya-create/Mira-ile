
import React, {useState} from "react";
import {
  View, Text, Image, Pressable, ScrollView,
  StyleSheet, Dimensions
} from "react-native";
import {StatusBar} from "expo-status-bar";
import * as Speech from "expo-speech";
import Svg, {Path, Text as SvgText} from "react-native-svg";

const letters = ["A","B","C","Ç","D","E","F","G","Ğ","H","I","İ","J","K","L","M","N","O","Ö","P","R","S","Ş","T","U","Ü","V","Y","Z"];
const shapes = ["Daire","Kare","Üçgen","Dikdörtgen","Yıldız","Kalp"];
const colors = [
  ["Kırmızı","#F04452"],["Mavi","#3987F5"],
  ["Sarı","#FFC928"],["Yeşil","#36B879"],
  ["Mor","#9B68D7"],["Pembe","#F45BA5"],
  ["Turuncu","#FF8A35"]
];

export default function App() {
  const [page,setPage] = useState("home");
  const [index,setIndex] = useState(0);
  const [path,setPath] = useState("");
  const [stars,setStars] = useState(0);
  const [done,setDone] = useState(false);
  const [size,setSize] = useState(300);

  const say = (text) => Speech.speak(text,{
    language:"tr-TR",rate:0.85,pitch:1.1
  });

  const go = (p) => {
    setPage(p);
    setIndex(0);
    setPath("");
    setDone(false);
    say("Merhaba! Ben Mira. Haydi birlikte öğrenelim!");
  };

  const next = () => {
    setIndex(i => i+1);
    setPath("");
    setDone(false);
  };

  const touchStart = (e) => {
    const {locationX,locationY} = e.nativeEvent;
    setPath(`M ${locationX*300/size} ${locationY*300/size}`);
    setDone(false);
  };

  const touchMove = (e) => {
    const {locationX,locationY} = e.nativeEvent;
    const x = locationX*300/size;
    const y = locationY*300/size;
    setPath(p => p+` L ${x} ${y}`);
  };

  const touchEnd = () => {
    if (!path) return;
    setStars(s=>s+1);
    setDone(true);
    say("Harikasın! Çok güzel çizdin. Bir yıldız kazandın!");
  };

  const Button = ({emoji,title,color,onPress}) => (
    <Pressable onPress={onPress}
      style={[styles.menu,{backgroundColor:color}]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.menuText}>{title}</Text>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark"/>

      {page==="home" ? (
        <ScrollView contentContainerStyle={styles.home}>
          <Text style={styles.brand}>🌸 Mira ile{"\n"}Öğreniyorum</Text>

          <View style={styles.teacher}>
            <Image
              source={require("./assets/öğretmen.png")}
              style={styles.photo}
              resizeMode="cover"
            />
            <View style={{flex:1}}>
              <Text style={styles.hello}>Merhaba!</Text>
              <Text style={styles.description}>
                Ben Mira. Haydi birlikte öğrenelim!
              </Text>
              <Pressable onPress={()=>say("Merhaba! Ben Mira. Haydi birlikte öğrenelim!")}>
                <Text style={styles.listen}>🔊 Beni dinle</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.subtitle}>Bugün ne öğrenmek istersin?</Text>

          <Button emoji="🔤" title="Harfleri Öğrenelim"
            color="#F45BA5" onPress={()=>go("letters")}/>
          <Button emoji="🔢" title="Sayıları Öğrenelim"
            color="#3987F5" onPress={()=>go("numbers")}/>
          <Button emoji="🔺" title="Şekilleri Öğrenelim"
            color="#36B879" onPress={()=>go("shapes")}/>
          <Button emoji="🎨" title="Renkleri Öğrenelim"
            color="#FFAA42" onPress={()=>go("colors")}/>

          <Text style={styles.score}>🏆 Yıldızların: {stars}</Text>
        </ScrollView>
      ) : (
        <View style={styles.lesson}>
          <View style={styles.header}>
            <Pressable onPress={()=>setPage("home")}>
              <Text style={styles.back}>‹</Text>
            </Pressable>
            <Text style={styles.headerTitle}>
              {page==="letters"?"Harfler":
               page==="numbers"?"Sayılar":
               page==="shapes"?"Şekiller":"Renkler"}
            </Text>
            <Text style={styles.scoreSmall}>⭐ {stars}</Text>
          </View>

          {page==="letters" || page==="numbers" ? (
            <>
              <Text style={styles.instruction}>
                Mira diyor ki:{"\n"}
                {page==="letters"
                  ? `${letters[index%29]} harfini çiz!`
                  : `${index%20+1} sayısını öğren!`}
              </Text>

              <Pressable style={styles.listenButton}
                onPress={()=>say(page==="letters"
                  ? `${letters[index%29]} harfi. Haydi parmağınla çiz!`
                  : `${index%20+1} sayısı. Haydi birlikte öğrenelim!`)}>
                <Text style={styles.listen}>🔊 Mira'yı dinle</Text>
              </Pressable>

              <View
                style={styles.canvas}
                onLayout={e=>setSize(e.nativeEvent.layout.width)}
                onTouchStart={touchStart}
                onTouchMove={touchMove}
                onTouchEnd={touchEnd}>
                <Svg width="100%" height="100%" viewBox="0 0 300 300">
                  <SvgText x="150" y="220"
                    fontSize="200" fontWeight="bold"
                    textAnchor="middle" fill="#FCE2EF"
                    stroke="#E7A4C5" strokeWidth="2">
                    {page==="letters"
                      ? letters[index%29]
                      : String(index%20+1)}
                  </SvgText>
                  {path ? <Path d={path} stroke="#F0449A"
                    strokeWidth="12" fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"/> : null}
                </Svg>
              </View>

              <Text style={styles.result}>
                {done?"🌟 Harikasın! Yıldız kazandın!":
                 "👆 Parmağınla harfin üzerinden geç"}
              </Text>

              <View style={styles.actions}>
                <Pressable style={styles.retry}
                  onPress={()=>{setPath("");setDone(false);}}>
                  <Text style={styles.actionText}>↻ Tekrar çiz</Text>
                </Pressable>
                <Pressable style={styles.next}
                  onPress={next}>
                  <Text style={styles.actionText}>Sonraki ➜</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <ScrollView contentContainerStyle={styles.grid}>
              <Text style={styles.instruction}>
                Mira ile birlikte öğrenelim!
              </Text>

              {page==="shapes" ? shapes.map((s,i)=>(
                <Pressable key={s} style={styles.tile}
                  onPress={()=>say(`Bu bir ${s.toLocaleLowerCase("tr-TR")}.`)}>
                  <Text style={{fontSize:55,color:"#E75A9E"}}>
                    {["●","■","▲","▰","★","♥"][i]}
                  </Text>
                  <Text style={styles.tileText}>{s}</Text>
                  <Text>🔊 Dinle</Text>
                </Pressable>
              )) : colors.map(c=>(
                <Pressable key={c[0]} style={styles.tile}
                  onPress={()=>say(`Bu renk ${c[0].toLocaleLowerCase("tr-TR")}.`)}>
                  <View style={{width:65,height:65,borderRadius:40,
                    backgroundColor:c[1]}}/>
                  <Text style={styles.tileText}>{c[0]}</Text>
                  <Text>🔊 Dinle</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#FFF7FB"},
  home:{padding:20,paddingTop:35},
  brand:{fontSize:34,fontWeight:"900",color:"#D83F91",
    textAlign:"center",marginBottom:22},
  teacher:{backgroundColor:"#FFE3F0",borderRadius:24,
    padding:14,flexDirection:"row",alignItems:"center",
    marginBottom:25,borderWidth:2,borderColor:"#FFC3DE"},
  photo:{width:115,height:135,borderRadius:18,marginRight:12},
  hello:{fontSize:25,fontWeight:"900",color:"#B72B79"},
  description:{fontSize:15,color:"#673B55",marginTop:5},
  listen:{fontSize:16,fontWeight:"900",color:"#A92770",marginTop:10},
  subtitle:{fontSize:19,fontWeight:"900",marginBottom:14,color:"#4B3850"},
  menu:{borderRadius:20,padding:17,marginBottom:13,
    flexDirection:"row",alignItems:"center",elevation:2},
  emoji:{fontSize:32,marginRight:14},
  menuText:{fontSize:18,fontWeight:"900",color:"white",flex:1},
  arrow:{fontSize:30,color:"white"},
  score:{textAlign:"center",fontSize:18,fontWeight:"900",
    color:"#9D4C7A",marginTop:15},
  lesson:{flex:1},
  header:{height:65,flexDirection:"row",alignItems:"center",
    justifyContent:"space-between",paddingHorizontal:18},
  back:{fontSize:40,color:"#C43A83"},
  headerTitle:{fontSize:22,fontWeight:"900",color:"#A52C70"},
  scoreSmall:{fontSize:18,fontWeight:"900",color:"#9D6A12"},
  instruction:{fontSize:20,fontWeight:"900",color:"#604052",
    textAlign:"center",margin:15},
  listenButton:{alignSelf:"center",backgroundColor:"#FFE0EF",
    padding:10,borderRadius:18,marginBottom:15},
  canvas:{height:330,marginHorizontal:18,backgroundColor:"white",
    borderRadius:24,borderWidth:2,borderColor:"#F4C5DC",
    overflow:"hidden"},
  result:{textAlign:"center",fontSize:18,fontWeight:"900",
    color:"#269B63",marginTop:18},
  actions:{flexDirection:"row",justifyContent:"center",gap:12,marginTop:20},
  retry:{backgroundColor:"#B69ACF",padding:15,borderRadius:16},
  next:{backgroundColor:"#F45BA5",padding:15,borderRadius:16},
  actionText:{color:"white",fontSize:16,fontWeight:"900"},
  grid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"center",
    gap:12,padding:15},
  tile:{width:"44%",minHeight:150,backgroundColor:"white",
    borderRadius:20,alignItems:"center",justifyContent:"center",
    padding:12,borderWidth:1,borderColor:"#F2D7E5"},
  tileText:{fontSize:18,fontWeight:"900",color:"#69475B",margin:7}
});

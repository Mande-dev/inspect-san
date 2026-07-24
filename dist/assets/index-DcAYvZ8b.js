(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))a(c);new MutationObserver(c=>{for(const r of c)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(c){const r={};return c.integrity&&(r.integrity=c.integrity),c.referrerPolicy&&(r.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?r.credentials="include":c.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(c){if(c.ep)return;c.ep=!0;const r=n(c);fetch(c.href,r)}})();const Ve=[{id:"com-001",nom:"Ngaba",actif:!0},{id:"com-002",nom:"Lemba",actif:!0},{id:"com-003",nom:"Limete",actif:!0},{id:"com-004",nom:"Matete",actif:!0},{id:"com-005",nom:"Kisenso",actif:!0},{id:"com-006",nom:"Makala",actif:!0},{id:"com-007",nom:"Kalamu",actif:!0},{id:"com-008",nom:"Kasa-Vubu",actif:!0},{id:"com-009",nom:"Bandalungwa",actif:!0},{id:"com-010",nom:"Ngiri-Ngiri",actif:!0},{id:"com-011",nom:"Selembao",actif:!0},{id:"com-012",nom:"Mont-Ngafula",actif:!0}],Ye=[{id:"reg-001",nom:"Public",actif:!0},{id:"reg-002",nom:"Privé conventionné",actif:!0},{id:"reg-003",nom:"Privé non conventionné",actif:!0},{id:"reg-004",nom:"Confessionnel",actif:!0}],Qe=[{id:"td-001",code:"maintien",libelle:"Maintien",actif:!0},{id:"td-002",code:"rehabilitation",libelle:"Réhabilitation",actif:!0},{id:"td-003",code:"fermeture_temporaire",libelle:"Fermeture temporaire",actif:!0},{id:"td-004",code:"fermeture_definitive",libelle:"Fermeture définitive",actif:!0}],We=[{id:"eco-001",denomination:"École Primaire Saint-Joseph n°1",regime:"Public",idDinacope:"DIN-KIN-MA-0001",numAgrement:null,numNotification:null,documents:[],adresse:{commune:"Ngaba",quartier:"Salongo",avenue:"Avenue de l'Université",numero:"10"},statut:"active",createdAt:"2022-01-05T08:00:00.000Z",updatedAt:"2024-01-08T08:00:00.000Z"},{id:"eco-002",denomination:"Institut Notre-Dame",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0002",numAgrement:"AGR/2021/002",numNotification:"NOT/2022/002",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Lemba",quartier:"Righini",avenue:"Avenue By-Pass",numero:"13"},statut:"rehabilitation",createdAt:"2022-02-06T08:00:00.000Z",updatedAt:"2024-02-09T08:00:00.000Z"},{id:"eco-003",denomination:"Collège Patrice Lumumba",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0003",numAgrement:"AGR/2022/003",numNotification:"NOT/2023/003",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Limete",quartier:"Livulu",avenue:"Avenue Lumumba",numero:"16"},statut:"fermeture_temporaire",createdAt:"2022-03-07T08:00:00.000Z",updatedAt:"2024-03-10T08:00:00.000Z"},{id:"eco-004",denomination:"Complexe Scolaire Kimpa Vita",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0004",numAgrement:"AGR/2023/004",numNotification:"NOT/2024/004",documents:[],adresse:{commune:"Matete",quartier:"Yolo",avenue:"Avenue de la Libération",numero:"19"},statut:"fermeture_definitive",createdAt:"2022-04-08T08:00:00.000Z",updatedAt:"2024-04-11T08:00:00.000Z"},{id:"eco-005",denomination:"Lycée Mandela",regime:"Public",idDinacope:"DIN-KIN-MA-0005",numAgrement:null,numNotification:"NOT/2025/005",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Kisenso",quartier:"Matonge",avenue:"Avenue Kasa-Vubu",numero:"22"},statut:"active",createdAt:"2022-05-09T08:00:00.000Z",updatedAt:"2024-05-12T08:00:00.000Z"},{id:"eco-006",denomination:"Centre d'Éducation de la Paix n°6",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0006",numAgrement:"AGR/2025/006",numNotification:null,documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Makala",quartier:"Kinshasa",avenue:"Avenue du Commerce",numero:"25"},statut:"rehabilitation",createdAt:"2022-06-10T08:00:00.000Z",updatedAt:"2024-06-13T08:00:00.000Z"},{id:"eco-007",denomination:"Groupe Scolaire Espoir",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0007",numAgrement:"AGR/2020/007",numNotification:"NOT/2022/007",documents:[],adresse:{commune:"Kalamu",quartier:"Camp Luka",avenue:"Avenue Tombalbaye",numero:"28"},statut:"fermeture_temporaire",createdAt:"2022-07-11T08:00:00.000Z",updatedAt:"2024-07-14T08:00:00.000Z"},{id:"eco-008",denomination:"École Secondaire du Progrès",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0008",numAgrement:"AGR/2021/008",numNotification:"NOT/2023/008",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Kasa-Vubu",quartier:"Masina",avenue:"Avenue Wagenia",numero:"31"},statut:"fermeture_definitive",createdAt:"2022-08-12T08:00:00.000Z",updatedAt:"2024-08-15T08:00:00.000Z"},{id:"eco-009",denomination:"École Primaire Sainte-Thérèse",regime:"Public",idDinacope:"DIN-KIN-MA-0009",numAgrement:null,numNotification:"NOT/2024/009",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Bandalungwa",quartier:"Ndjili",avenue:"Avenue de la Paix",numero:"34"},statut:"active",createdAt:"2022-09-13T08:00:00.000Z",updatedAt:"2024-09-16T08:00:00.000Z"},{id:"eco-010",denomination:"Institut Mwanga",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0010",numAgrement:"AGR/2023/010",numNotification:"NOT/2025/010",documents:[],adresse:{commune:"Ngiri-Ngiri",quartier:"Bumbu",avenue:"Avenue Victoire",numero:"37"},statut:"rehabilitation",createdAt:"2022-10-14T08:00:00.000Z",updatedAt:"2024-10-17T08:00:00.000Z"},{id:"eco-011",denomination:"Collège Kimbangu n°11",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0011",numAgrement:"AGR/2024/011",numNotification:null,documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Selembao",quartier:"Binza",avenue:"Avenue Huileries",numero:"40"},statut:"fermeture_temporaire",createdAt:"2022-11-15T08:00:00.000Z",updatedAt:"2024-11-18T08:00:00.000Z"},{id:"eco-012",denomination:"Complexe Scolaire de Mont-Amba",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0012",numAgrement:"AGR/2025/012",numNotification:"NOT/2022/012",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Mont-Ngafula",quartier:"Kimbanseke",avenue:"Avenue Flambeau",numero:"43"},statut:"fermeture_definitive",createdAt:"2022-12-16T08:00:00.000Z",updatedAt:"2024-12-19T08:00:00.000Z"},{id:"eco-013",denomination:"Lycée Avenir",regime:"Public",idDinacope:"DIN-KIN-MA-0013",numAgrement:null,numNotification:"NOT/2023/013",documents:[],adresse:{commune:"Ngaba",quartier:"Salongo",avenue:"Avenue de l'Université",numero:"46"},statut:"active",createdAt:"2022-01-17T08:00:00.000Z",updatedAt:"2024-01-20T08:00:00.000Z"},{id:"eco-014",denomination:"Centre d'Éducation Excellence",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0014",numAgrement:"AGR/2021/014",numNotification:"NOT/2024/014",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Lemba",quartier:"Righini",avenue:"Avenue By-Pass",numero:"49"},statut:"rehabilitation",createdAt:"2022-02-18T08:00:00.000Z",updatedAt:"2024-02-21T08:00:00.000Z"},{id:"eco-015",denomination:"Groupe Scolaire Réussite",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0015",numAgrement:"AGR/2022/015",numNotification:"NOT/2025/015",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Limete",quartier:"Livulu",avenue:"Avenue Lumumba",numero:"52"},statut:"fermeture_temporaire",createdAt:"2022-03-19T08:00:00.000Z",updatedAt:"2024-03-22T08:00:00.000Z"},{id:"eco-016",denomination:"École Secondaire Bilingue Congolais n°16",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0016",numAgrement:"AGR/2023/016",numNotification:null,documents:[],adresse:{commune:"Matete",quartier:"Yolo",avenue:"Avenue de la Libération",numero:"55"},statut:"fermeture_definitive",createdAt:"2022-04-20T08:00:00.000Z",updatedAt:"2024-04-23T08:00:00.000Z"},{id:"eco-017",denomination:"École Primaire Technique Industriel",regime:"Public",idDinacope:"DIN-KIN-MA-0017",numAgrement:null,numNotification:"NOT/2022/017",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Kisenso",quartier:"Matonge",avenue:"Avenue Kasa-Vubu",numero:"58"},statut:"active",createdAt:"2022-05-21T08:00:00.000Z",updatedAt:"2024-05-24T08:00:00.000Z"},{id:"eco-018",denomination:"Institut Commercial",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0018",numAgrement:"AGR/2025/018",numNotification:"NOT/2023/018",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Makala",quartier:"Kinshasa",avenue:"Avenue du Commerce",numero:"61"},statut:"rehabilitation",createdAt:"2022-06-22T08:00:00.000Z",updatedAt:"2024-06-25T08:00:00.000Z"},{id:"eco-019",denomination:"Collège l'Alliance des Peuples pour l'Éducation Intégrale et le Développement Durable de Kinshasa",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0019",numAgrement:"AGR/2020/019",numNotification:"NOT/2024/019",documents:[],adresse:{commune:"Kalamu",quartier:"Camp Luka",avenue:"Avenue Tombalbaye",numero:"64"},statut:"fermeture_temporaire",createdAt:"2022-07-23T08:00:00.000Z",updatedAt:"2024-07-08T08:00:00.000Z"},{id:"eco-020",denomination:"Complexe Scolaire Boboto",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0020",numAgrement:"AGR/2021/020",numNotification:"NOT/2025/020",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Kasa-Vubu",quartier:"Masina",avenue:"Avenue Wagenia",numero:"67"},statut:"fermeture_definitive",createdAt:"2022-08-24T08:00:00.000Z",updatedAt:"2024-08-09T08:00:00.000Z"},{id:"eco-021",denomination:"Lycée Salongo n°21",regime:"Public",idDinacope:"DIN-KIN-MA-0021",numAgrement:null,numNotification:null,documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Bandalungwa",quartier:"Ndjili",avenue:"Avenue de la Paix",numero:"70"},statut:"active",createdAt:"2022-09-05T08:00:00.000Z",updatedAt:"2024-09-10T08:00:00.000Z"},{id:"eco-022",denomination:"Centre d'Éducation Umoja",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0022",numAgrement:"AGR/2023/022",numNotification:"NOT/2022/022",documents:[],adresse:{commune:"Ngiri-Ngiri",quartier:"Bumbu",avenue:"Avenue Victoire",numero:"73"},statut:"rehabilitation",createdAt:"2022-10-06T08:00:00.000Z",updatedAt:"2024-10-11T08:00:00.000Z"},{id:"eco-023",denomination:"Groupe Scolaire Liberté",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0023",numAgrement:"AGR/2024/023",numNotification:"NOT/2023/023",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Selembao",quartier:"Binza",avenue:"Avenue Huileries",numero:"76"},statut:"fermeture_temporaire",createdAt:"2022-11-07T08:00:00.000Z",updatedAt:"2024-11-12T08:00:00.000Z"},{id:"eco-024",denomination:"École Secondaire Justice",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0024",numAgrement:"AGR/2025/024",numNotification:"NOT/2024/024",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Mont-Ngafula",quartier:"Kimbanseke",avenue:"Avenue Flambeau",numero:"79"},statut:"fermeture_definitive",createdAt:"2022-12-08T08:00:00.000Z",updatedAt:"2024-12-13T08:00:00.000Z"},{id:"eco-025",denomination:"École Primaire Saint-Joseph",regime:"Public",idDinacope:"DIN-KIN-MA-0025",numAgrement:null,numNotification:"NOT/2025/025",documents:[],adresse:{commune:"Ngaba",quartier:"Salongo",avenue:"Avenue de l'Université",numero:"82"},statut:"active",createdAt:"2022-01-09T08:00:00.000Z",updatedAt:"2024-01-14T08:00:00.000Z"},{id:"eco-026",denomination:"Institut Notre-Dame n°26",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0026",numAgrement:"AGR/2021/026",numNotification:null,documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Lemba",quartier:"Righini",avenue:"Avenue By-Pass",numero:"85"},statut:"rehabilitation",createdAt:"2022-02-10T08:00:00.000Z",updatedAt:"2024-02-15T08:00:00.000Z"},{id:"eco-027",denomination:"Collège Patrice Lumumba",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0027",numAgrement:"AGR/2022/027",numNotification:"NOT/2022/027",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Limete",quartier:"Livulu",avenue:"Avenue Lumumba",numero:"88"},statut:"fermeture_temporaire",createdAt:"2022-03-11T08:00:00.000Z",updatedAt:"2024-03-16T08:00:00.000Z"},{id:"eco-028",denomination:"Complexe Scolaire Kimpa Vita",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0028",numAgrement:"AGR/2023/028",numNotification:"NOT/2023/028",documents:[],adresse:{commune:"Matete",quartier:"Yolo",avenue:"Avenue de la Libération",numero:"91"},statut:"fermeture_definitive",createdAt:"2022-04-12T08:00:00.000Z",updatedAt:"2024-04-17T08:00:00.000Z"},{id:"eco-029",denomination:"Lycée Mandela",regime:"Public",idDinacope:"DIN-KIN-MA-0029",numAgrement:null,numNotification:"NOT/2024/029",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Kisenso",quartier:"Matonge",avenue:"Avenue Kasa-Vubu",numero:"94"},statut:"active",createdAt:"2022-05-13T08:00:00.000Z",updatedAt:"2024-05-18T08:00:00.000Z"},{id:"eco-030",denomination:"Centre d'Éducation de la Paix",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0030",numAgrement:"AGR/2025/030",numNotification:"NOT/2025/030",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Makala",quartier:"Kinshasa",avenue:"Avenue du Commerce",numero:"97"},statut:"rehabilitation",createdAt:"2022-06-14T08:00:00.000Z",updatedAt:"2024-06-19T08:00:00.000Z"},{id:"eco-031",denomination:"Groupe Scolaire Espoir n°31",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0031",numAgrement:"AGR/2020/031",numNotification:null,documents:[],adresse:{commune:"Kalamu",quartier:"Camp Luka",avenue:"Avenue Tombalbaye",numero:"10"},statut:"fermeture_temporaire",createdAt:"2022-07-15T08:00:00.000Z",updatedAt:"2024-07-20T08:00:00.000Z"},{id:"eco-032",denomination:"École Secondaire du Progrès",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0032",numAgrement:"AGR/2021/032",numNotification:"NOT/2022/032",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Kasa-Vubu",quartier:"Masina",avenue:"Avenue Wagenia",numero:"13"},statut:"fermeture_definitive",createdAt:"2022-08-16T08:00:00.000Z",updatedAt:"2024-08-21T08:00:00.000Z"},{id:"eco-033",denomination:"École Primaire Sainte-Thérèse",regime:"Public",idDinacope:"DIN-KIN-MA-0033",numAgrement:null,numNotification:"NOT/2023/033",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Bandalungwa",quartier:"Ndjili",avenue:"Avenue de la Paix",numero:"16"},statut:"active",createdAt:"2022-09-17T08:00:00.000Z",updatedAt:"2024-09-22T08:00:00.000Z"},{id:"eco-034",denomination:"Institut Mwanga",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0034",numAgrement:"AGR/2023/034",numNotification:"NOT/2024/034",documents:[],adresse:{commune:"Ngiri-Ngiri",quartier:"Bumbu",avenue:"Avenue Victoire",numero:"19"},statut:"rehabilitation",createdAt:"2022-10-18T08:00:00.000Z",updatedAt:"2024-10-23T08:00:00.000Z"},{id:"eco-035",denomination:"Collège Kimbangu",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0035",numAgrement:"AGR/2024/035",numNotification:"NOT/2025/035",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Selembao",quartier:"Binza",avenue:"Avenue Huileries",numero:"22"},statut:"fermeture_temporaire",createdAt:"2022-11-19T08:00:00.000Z",updatedAt:"2024-11-24T08:00:00.000Z"},{id:"eco-036",denomination:"Complexe Scolaire de Mont-Amba n°36",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0036",numAgrement:"AGR/2025/036",numNotification:null,documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Mont-Ngafula",quartier:"Kimbanseke",avenue:"Avenue Flambeau",numero:"25"},statut:"fermeture_definitive",createdAt:"2022-12-20T08:00:00.000Z",updatedAt:"2024-12-25T08:00:00.000Z"},{id:"eco-037",denomination:"Lycée Avenir",regime:"Public",idDinacope:"DIN-KIN-MA-0037",numAgrement:null,numNotification:"NOT/2022/037",documents:[],adresse:{commune:"Ngaba",quartier:"Salongo",avenue:"Avenue de l'Université",numero:"28"},statut:"active",createdAt:"2022-01-21T08:00:00.000Z",updatedAt:"2024-01-08T08:00:00.000Z"},{id:"eco-038",denomination:"Centre d'Éducation Excellence",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0038",numAgrement:"AGR/2021/038",numNotification:"NOT/2023/038",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Lemba",quartier:"Righini",avenue:"Avenue By-Pass",numero:"31"},statut:"rehabilitation",createdAt:"2022-02-22T08:00:00.000Z",updatedAt:"2024-02-09T08:00:00.000Z"},{id:"eco-039",denomination:"Groupe Scolaire Réussite",regime:"Privé non conventionné",idDinacope:"DIN-KIN-MA-0039",numAgrement:"AGR/2022/039",numNotification:"NOT/2024/039",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Limete",quartier:"Livulu",avenue:"Avenue Lumumba",numero:"34"},statut:"fermeture_temporaire",createdAt:"2022-03-23T08:00:00.000Z",updatedAt:"2024-03-10T08:00:00.000Z"},{id:"eco-040",denomination:"École Secondaire Bilingue Congolais",regime:"Confessionnel",idDinacope:"DIN-KIN-MA-0040",numAgrement:"AGR/2023/040",numNotification:"NOT/2025/040",documents:[],adresse:{commune:"Matete",quartier:"Yolo",avenue:"Avenue de la Libération",numero:"37"},statut:"fermeture_definitive",createdAt:"2022-04-24T08:00:00.000Z",updatedAt:"2024-04-11T08:00:00.000Z"},{id:"eco-041",denomination:"École Primaire Technique Industriel n°41",regime:"Public",idDinacope:"DIN-KIN-MA-0041",numAgrement:null,numNotification:null,documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"},{nom:"notification.pdf",taille:"128 Ko",date:"2023-05-02T08:00:00.000Z"}],adresse:{commune:"Kisenso",quartier:"Matonge",avenue:"Avenue Kasa-Vubu",numero:"40"},statut:"active",createdAt:"2022-05-05T08:00:00.000Z",updatedAt:"2024-05-12T08:00:00.000Z"},{id:"eco-042",denomination:"Institut Commercial",regime:"Privé conventionné",idDinacope:"DIN-KIN-MA-0042",numAgrement:"AGR/2025/042",numNotification:"NOT/2022/042",documents:[{nom:"agrément.pdf",taille:"245 Ko",date:"2023-03-10T08:00:00.000Z"}],adresse:{commune:"Makala",quartier:"Kinshasa",avenue:"Avenue du Commerce",numero:"43"},statut:"rehabilitation",createdAt:"2022-06-06T08:00:00.000Z",updatedAt:"2024-06-13T08:00:00.000Z"}],Xe=[{id:"chef-001",nomComplet:"Jean Tshibanda",idDinacope:"DIN-CHEF-0001",ancienneteEnseignement:2,ancienneteChef:0,ancienneteEcole:0,telephone:null,ecoleId:"eco-001",createdAt:"2021-02-03T08:00:00.000Z"},{id:"chef-002",nomComplet:"Marie Mwamba",idDinacope:"DIN-CHEF-0002",ancienneteEnseignement:3,ancienneteChef:1,ancienneteEcole:1,telephone:"+243810000137",ecoleId:"eco-002",createdAt:"2021-03-04T08:00:00.000Z"},{id:"chef-003",nomComplet:"Patrick Kalonji",idDinacope:"DIN-CHEF-0003",ancienneteEnseignement:4,ancienneteChef:2,ancienneteEcole:2,telephone:"+243810000274",ecoleId:"eco-003",createdAt:"2021-04-05T08:00:00.000Z"},{id:"chef-004",nomComplet:"Grace Ngalula",idDinacope:"DIN-CHEF-0004",ancienneteEnseignement:5,ancienneteChef:3,ancienneteEcole:3,telephone:"+243810000411",ecoleId:"eco-004",createdAt:"2021-05-06T08:00:00.000Z"},{id:"chef-005",nomComplet:"Joseph Kabasele",idDinacope:"DIN-CHEF-0005",ancienneteEnseignement:6,ancienneteChef:4,ancienneteEcole:4,telephone:"+243810000548",ecoleId:"eco-005",createdAt:"2021-06-07T08:00:00.000Z"},{id:"chef-006",nomComplet:"Thérèse Lumbala",idDinacope:"DIN-CHEF-0006",ancienneteEnseignement:7,ancienneteChef:5,ancienneteEcole:5,telephone:"+243810000685",ecoleId:"eco-006",createdAt:"2021-07-08T08:00:00.000Z"},{id:"chef-007",nomComplet:"Pierre Mbuyi",idDinacope:"DIN-CHEF-0007",ancienneteEnseignement:8,ancienneteChef:6,ancienneteEcole:6,telephone:"+243810000822",ecoleId:"eco-007",createdAt:"2021-08-09T08:00:00.000Z"},{id:"chef-008",nomComplet:"Christine Kasongo",idDinacope:"DIN-CHEF-0008",ancienneteEnseignement:9,ancienneteChef:7,ancienneteEcole:7,telephone:null,ecoleId:"eco-008",createdAt:"2021-09-10T08:00:00.000Z"},{id:"chef-009",nomComplet:"André Ndaya",idDinacope:"DIN-CHEF-0009",ancienneteEnseignement:10,ancienneteChef:8,ancienneteEcole:8,telephone:"+243810001096",ecoleId:"eco-009",createdAt:"2021-10-11T08:00:00.000Z"},{id:"chef-010",nomComplet:"Véronique Kabila",idDinacope:"DIN-CHEF-0010",ancienneteEnseignement:11,ancienneteChef:9,ancienneteEcole:9,telephone:"+243810001233",ecoleId:"eco-010",createdAt:"2021-11-12T08:00:00.000Z"},{id:"chef-011",nomComplet:"François Tshisekedi",idDinacope:"DIN-CHEF-0011",ancienneteEnseignement:12,ancienneteChef:10,ancienneteEcole:0,telephone:"+243810001370",ecoleId:"eco-011",createdAt:"2021-02-13T08:00:00.000Z"},{id:"chef-012",nomComplet:"Chantal d'Almeida",idDinacope:"DIN-CHEF-0012",ancienneteEnseignement:13,ancienneteChef:11,ancienneteEcole:1,telephone:"+243810001507",ecoleId:"eco-012",createdAt:"2021-03-14T08:00:00.000Z"},{id:"chef-013",nomComplet:"Michel O'Brien-Mukuna",idDinacope:"DIN-CHEF-0013",ancienneteEnseignement:14,ancienneteChef:12,ancienneteEcole:2,telephone:"+243810001644",ecoleId:"eco-013",createdAt:"2021-04-15T08:00:00.000Z"},{id:"chef-014",nomComplet:"Ange Nzuzi",idDinacope:"DIN-CHEF-0014",ancienneteEnseignement:15,ancienneteChef:13,ancienneteEcole:3,telephone:"+243810001781",ecoleId:"eco-014",createdAt:"2021-05-16T08:00:00.000Z"},{id:"chef-015",nomComplet:"Dieu-Merci Banza",idDinacope:"DIN-CHEF-0015",ancienneteEnseignement:16,ancienneteChef:14,ancienneteEcole:4,telephone:null,ecoleId:"eco-015",createdAt:"2021-06-17T08:00:00.000Z"},{id:"chef-016",nomComplet:"Espérance Kalala",idDinacope:"DIN-CHEF-0016",ancienneteEnseignement:17,ancienneteChef:0,ancienneteEcole:5,telephone:"+243810002055",ecoleId:"eco-016",createdAt:"2021-07-18T08:00:00.000Z"},{id:"chef-017",nomComplet:"Patient Mputu",idDinacope:"DIN-CHEF-0017",ancienneteEnseignement:18,ancienneteChef:1,ancienneteEcole:6,telephone:"+243810002192",ecoleId:"eco-017",createdAt:"2021-08-19T08:00:00.000Z"},{id:"chef-018",nomComplet:"Fiston Lukusa",idDinacope:"DIN-CHEF-0018",ancienneteEnseignement:19,ancienneteChef:2,ancienneteEcole:7,telephone:"+243810002329",ecoleId:"eco-018",createdAt:"2021-09-20T08:00:00.000Z"},{id:"chef-019",nomComplet:"Nadine Nsenga",idDinacope:"DIN-CHEF-0019",ancienneteEnseignement:20,ancienneteChef:3,ancienneteEcole:8,telephone:"+243810002466",ecoleId:"eco-019",createdAt:"2021-10-21T08:00:00.000Z"},{id:"chef-020",nomComplet:"Blaise Kanku",idDinacope:"DIN-CHEF-0020",ancienneteEnseignement:21,ancienneteChef:4,ancienneteEcole:9,telephone:"+243810002603",ecoleId:"eco-020",createdAt:"2021-11-22T08:00:00.000Z"},{id:"chef-021",nomComplet:"Aimée Mulamba",idDinacope:"DIN-CHEF-0021",ancienneteEnseignement:22,ancienneteChef:5,ancienneteEcole:0,telephone:"+243810002740",ecoleId:"eco-021",createdAt:"2021-02-23T08:00:00.000Z"},{id:"chef-022",nomComplet:"Serge Cibangu",idDinacope:"DIN-CHEF-0022",ancienneteEnseignement:23,ancienneteChef:6,ancienneteEcole:1,telephone:null,ecoleId:"eco-022",createdAt:"2021-03-24T08:00:00.000Z"},{id:"chef-023",nomComplet:"Mireille Wamba",idDinacope:"DIN-CHEF-0023",ancienneteEnseignement:24,ancienneteChef:7,ancienneteEcole:2,telephone:"+243810003014",ecoleId:"eco-023",createdAt:"2021-04-25T08:00:00.000Z"},{id:"chef-024",nomComplet:"Hervé Katanga",idDinacope:"DIN-CHEF-0024",ancienneteEnseignement:25,ancienneteChef:8,ancienneteEcole:3,telephone:"+243810003151",ecoleId:"eco-024",createdAt:"2021-05-26T08:00:00.000Z"},{id:"chef-025",nomComplet:"Carine Mukendi",idDinacope:"DIN-CHEF-0025",ancienneteEnseignement:26,ancienneteChef:9,ancienneteEcole:4,telephone:"+243810003288",ecoleId:"eco-025",createdAt:"2021-06-27T08:00:00.000Z"},{id:"chef-026",nomComplet:"Yves Kabongo",idDinacope:"DIN-CHEF-0026",ancienneteEnseignement:27,ancienneteChef:10,ancienneteEcole:5,telephone:"+243810003425",ecoleId:"eco-026",createdAt:"2021-07-03T08:00:00.000Z"},{id:"chef-027",nomComplet:"Odile Ilunga",idDinacope:"DIN-CHEF-0027",ancienneteEnseignement:28,ancienneteChef:11,ancienneteEcole:6,telephone:"+243810003562",ecoleId:"eco-027",createdAt:"2021-08-04T08:00:00.000Z"},{id:"chef-028",nomComplet:"Célestin Tshibanda",idDinacope:"DIN-CHEF-0028",ancienneteEnseignement:29,ancienneteChef:12,ancienneteEcole:7,telephone:"+243810003699",ecoleId:"eco-028",createdAt:"2021-09-05T08:00:00.000Z"},{id:"chef-029",nomComplet:"Ruth Mwamba",idDinacope:"DIN-CHEF-0029",ancienneteEnseignement:2,ancienneteChef:13,ancienneteEcole:8,telephone:null,ecoleId:"eco-029",createdAt:"2021-10-06T08:00:00.000Z"},{id:"chef-030",nomComplet:"Emmanuel Kalonji",idDinacope:"DIN-CHEF-0030",ancienneteEnseignement:3,ancienneteChef:14,ancienneteEcole:9,telephone:"+243810003973",ecoleId:"eco-030",createdAt:"2021-11-07T08:00:00.000Z"},{id:"chef-031",nomComplet:"Jean Ngalula",idDinacope:"DIN-CHEF-0031",ancienneteEnseignement:4,ancienneteChef:0,ancienneteEcole:0,telephone:"+243810004110",ecoleId:"eco-031",createdAt:"2021-02-08T08:00:00.000Z"},{id:"chef-032",nomComplet:"Marie Kabasele",idDinacope:"DIN-CHEF-0032",ancienneteEnseignement:5,ancienneteChef:1,ancienneteEcole:1,telephone:"+243810004247",ecoleId:"eco-032",createdAt:"2021-03-09T08:00:00.000Z"},{id:"chef-033",nomComplet:"Patrick Lumbala",idDinacope:"DIN-CHEF-0033",ancienneteEnseignement:6,ancienneteChef:2,ancienneteEcole:2,telephone:"+243810004384",ecoleId:"eco-033",createdAt:"2021-04-10T08:00:00.000Z"},{id:"chef-034",nomComplet:"Grace Mbuyi",idDinacope:"DIN-CHEF-0034",ancienneteEnseignement:7,ancienneteChef:3,ancienneteEcole:3,telephone:"+243810004521",ecoleId:"eco-034",createdAt:"2021-05-11T08:00:00.000Z"},{id:"chef-035",nomComplet:"Joseph Kasongo",idDinacope:"DIN-CHEF-0035",ancienneteEnseignement:8,ancienneteChef:4,ancienneteEcole:4,telephone:"+243810004658",ecoleId:"eco-035",createdAt:"2021-06-12T08:00:00.000Z"},{id:"chef-036",nomComplet:"Thérèse Ndaya",idDinacope:"DIN-CHEF-0036",ancienneteEnseignement:9,ancienneteChef:5,ancienneteEcole:5,telephone:null,ecoleId:"eco-036",createdAt:"2021-07-13T08:00:00.000Z"},{id:"chef-037",nomComplet:"Pierre Kabila",idDinacope:"DIN-CHEF-0037",ancienneteEnseignement:10,ancienneteChef:6,ancienneteEcole:6,telephone:"+243810004932",ecoleId:"eco-037",createdAt:"2021-08-14T08:00:00.000Z"},{id:"chef-038",nomComplet:"Christine Tshisekedi",idDinacope:"DIN-CHEF-0038",ancienneteEnseignement:11,ancienneteChef:7,ancienneteEcole:7,telephone:"+243810005069",ecoleId:"eco-038",createdAt:"2021-09-15T08:00:00.000Z"},{id:"chef-039",nomComplet:"André d'Almeida",idDinacope:"DIN-CHEF-0039",ancienneteEnseignement:12,ancienneteChef:8,ancienneteEcole:8,telephone:"+243810005206",ecoleId:"eco-039",createdAt:"2021-10-16T08:00:00.000Z"},{id:"chef-040",nomComplet:"Véronique O'Brien-Mukuna",idDinacope:"DIN-CHEF-0040",ancienneteEnseignement:13,ancienneteChef:9,ancienneteEcole:9,telephone:"+243810005343",ecoleId:"eco-040",createdAt:"2021-11-17T08:00:00.000Z"},{id:"chef-041",nomComplet:"François Nzuzi",idDinacope:"DIN-CHEF-0041",ancienneteEnseignement:14,ancienneteChef:10,ancienneteEcole:0,telephone:"+243810005480",ecoleId:"eco-041",createdAt:"2021-02-18T08:00:00.000Z"},{id:"chef-042",nomComplet:"Chantal Banza",idDinacope:"DIN-CHEF-0042",ancienneteEnseignement:15,ancienneteChef:11,ancienneteEcole:1,telephone:"+243810005617",ecoleId:"eco-042",createdAt:"2021-03-19T08:00:00.000Z"},{id:"chef-043",nomComplet:"Michel Kalala",idDinacope:"DIN-CHEF-0043",ancienneteEnseignement:16,ancienneteChef:12,ancienneteEcole:2,telephone:null,ecoleId:"eco-001",createdAt:"2021-04-20T08:00:00.000Z"},{id:"chef-044",nomComplet:"Ange Mputu",idDinacope:"DIN-CHEF-0044",ancienneteEnseignement:17,ancienneteChef:13,ancienneteEcole:3,telephone:"+243810005891",ecoleId:"eco-002",createdAt:"2021-05-21T08:00:00.000Z"},{id:"chef-045",nomComplet:"Dieu-Merci Lukusa",idDinacope:"DIN-CHEF-0045",ancienneteEnseignement:18,ancienneteChef:14,ancienneteEcole:4,telephone:"+243810006028",ecoleId:"eco-003",createdAt:"2021-06-22T08:00:00.000Z"},{id:"chef-046",nomComplet:"Espérance Nsenga",idDinacope:"DIN-CHEF-0046",ancienneteEnseignement:19,ancienneteChef:0,ancienneteEcole:5,telephone:"+243810006165",ecoleId:"eco-004",createdAt:"2021-07-23T08:00:00.000Z"},{id:"chef-047",nomComplet:"Patient Kanku",idDinacope:"DIN-CHEF-0047",ancienneteEnseignement:20,ancienneteChef:1,ancienneteEcole:6,telephone:"+243810006302",ecoleId:"eco-005",createdAt:"2021-08-24T08:00:00.000Z"},{id:"chef-048",nomComplet:"Fiston Mulamba",idDinacope:"DIN-CHEF-0048",ancienneteEnseignement:21,ancienneteChef:2,ancienneteEcole:7,telephone:"+243810006439",ecoleId:"eco-006",createdAt:"2021-09-25T08:00:00.000Z"},{id:"chef-049",nomComplet:"Nadine Cibangu",idDinacope:"DIN-CHEF-0049",ancienneteEnseignement:22,ancienneteChef:3,ancienneteEcole:8,telephone:"+243810006576",ecoleId:"eco-007",createdAt:"2021-10-26T08:00:00.000Z"},{id:"chef-050",nomComplet:"Blaise Wamba",idDinacope:"DIN-CHEF-0050",ancienneteEnseignement:23,ancienneteChef:4,ancienneteEcole:9,telephone:null,ecoleId:"eco-008",createdAt:"2021-11-27T08:00:00.000Z"},{id:"chef-051",nomComplet:"Aimée Katanga",idDinacope:"DIN-CHEF-0051",ancienneteEnseignement:24,ancienneteChef:5,ancienneteEcole:0,telephone:"+243810006850",ecoleId:"eco-009",createdAt:"2021-02-03T08:00:00.000Z"},{id:"chef-052",nomComplet:"Serge Mukendi",idDinacope:"DIN-CHEF-0052",ancienneteEnseignement:25,ancienneteChef:6,ancienneteEcole:1,telephone:"+243810006987",ecoleId:"eco-010",createdAt:"2021-03-04T08:00:00.000Z"},{id:"chef-053",nomComplet:"Mireille Kabongo",idDinacope:"DIN-CHEF-0053",ancienneteEnseignement:26,ancienneteChef:7,ancienneteEcole:2,telephone:"+243810007124",ecoleId:"eco-011",createdAt:"2021-04-05T08:00:00.000Z"},{id:"chef-054",nomComplet:"Hervé Ilunga",idDinacope:"DIN-CHEF-0054",ancienneteEnseignement:27,ancienneteChef:8,ancienneteEcole:3,telephone:"+243810007261",ecoleId:"eco-012",createdAt:"2021-05-06T08:00:00.000Z"},{id:"chef-055",nomComplet:"Carine Tshibanda",idDinacope:"DIN-CHEF-0055",ancienneteEnseignement:28,ancienneteChef:9,ancienneteEcole:4,telephone:"+243810007398",ecoleId:"eco-013",createdAt:"2021-06-07T08:00:00.000Z"},{id:"chef-056",nomComplet:"Yves Mwamba",idDinacope:"DIN-CHEF-0056",ancienneteEnseignement:29,ancienneteChef:10,ancienneteEcole:5,telephone:"+243810007535",ecoleId:"eco-014",createdAt:"2021-07-08T08:00:00.000Z"},{id:"chef-057",nomComplet:"Odile Kalonji",idDinacope:"DIN-CHEF-0057",ancienneteEnseignement:2,ancienneteChef:11,ancienneteEcole:6,telephone:null,ecoleId:"eco-015",createdAt:"2021-08-09T08:00:00.000Z"},{id:"chef-058",nomComplet:"Célestin Ngalula",idDinacope:"DIN-CHEF-0058",ancienneteEnseignement:3,ancienneteChef:12,ancienneteEcole:7,telephone:"+243810007809",ecoleId:"eco-016",createdAt:"2021-09-10T08:00:00.000Z"},{id:"chef-059",nomComplet:"Ruth Kabasele",idDinacope:"DIN-CHEF-0059",ancienneteEnseignement:4,ancienneteChef:13,ancienneteEcole:8,telephone:"+243810007946",ecoleId:"eco-017",createdAt:"2021-10-11T08:00:00.000Z"},{id:"chef-060",nomComplet:"Emmanuel Lumbala",idDinacope:"DIN-CHEF-0060",ancienneteEnseignement:5,ancienneteChef:14,ancienneteEcole:9,telephone:"+243810008083",ecoleId:"eco-018",createdAt:"2021-11-12T08:00:00.000Z"},{id:"chef-061",nomComplet:"Jean Mbuyi",idDinacope:"DIN-CHEF-0061",ancienneteEnseignement:6,ancienneteChef:0,ancienneteEcole:0,telephone:"+243810008220",ecoleId:"eco-019",createdAt:"2021-02-13T08:00:00.000Z"},{id:"chef-062",nomComplet:"Marie Kasongo",idDinacope:"DIN-CHEF-0062",ancienneteEnseignement:7,ancienneteChef:1,ancienneteEcole:1,telephone:"+243810008357",ecoleId:null,createdAt:"2021-03-14T08:00:00.000Z"}],et=[{id:"usr-001",nom:"Admin Système",contact:"admin@inspect-san.cd",role:"Administrateur système",equipe:null,statut:"actif",identifiant:"admin",motDePasse:"admin123",telephone:"+243810001370",createdAt:"2022-01-10T08:00:00.000Z"},{id:"usr-002",nom:"Directeur Provincial Mukendi",contact:"dp@inspect-san.cd",role:"Directeur Provincial",equipe:null,statut:"actif",identifiant:"directeur",motDePasse:"dir123",telephone:"+243810001507",createdAt:"2022-02-10T08:00:00.000Z"},{id:"usr-003",nom:"Contrôleur Kabongo",contact:"ctrl1@inspect-san.cd",role:"Contrôleur",equipe:"Équipe Alpha",statut:"actif",identifiant:"controleur",motDePasse:"ctrl123",telephone:"+243810001644",createdAt:"2022-03-10T08:00:00.000Z"},{id:"usr-004",nom:"Contrôleur Ilunga",contact:"ctrl2@inspect-san.cd",role:"Contrôleur",equipe:"Équipe Alpha",statut:"actif",identifiant:"controleur2",motDePasse:"ctrl123",telephone:"+243810001781",createdAt:"2022-04-10T08:00:00.000Z"},{id:"usr-005",nom:"Contrôleur Tshibanda",contact:"ctrl3@inspect-san.cd",role:"Contrôleur",equipe:"Équipe Beta",statut:"actif",identifiant:"controleur3",motDePasse:"ctrl123",telephone:null,createdAt:"2022-05-10T08:00:00.000Z"},{id:"usr-006",nom:"Contrôleur Mwamba",contact:"ctrl4@inspect-san.cd",role:"Contrôleur",equipe:"Équipe Beta",statut:"inactif",identifiant:"controleur4",motDePasse:"ctrl123",telephone:"+243810002055",createdAt:"2022-06-10T08:00:00.000Z"},{id:"usr-007",nom:"Contrôleur Kalonji",contact:"ctrl5@inspect-san.cd",role:"Contrôleur",equipe:"Équipe Gamma",statut:"verrouille",identifiant:"controleur5",motDePasse:"ctrl123",telephone:"+243810002192",createdAt:"2022-07-10T08:00:00.000Z"},{id:"usr-008",nom:"Agent Secrétariat Ngalula",contact:"sec@inspect-san.cd",role:"Agent du Secrétariat",equipe:null,statut:"actif",identifiant:"secretariat",motDePasse:"sec123",telephone:"+243810002329",createdAt:"2022-08-10T08:00:00.000Z"},{id:"usr-009",nom:"Agent Secrétariat Mbuyi",contact:"sec2@inspect-san.cd",role:"Agent du Secrétariat",equipe:null,statut:"actif",identifiant:"secretariat2",motDePasse:"sec123",telephone:"+243810002466",createdAt:"2022-09-10T08:00:00.000Z"},{id:"usr-010",nom:"Chef Établissement Marie Kabongo",contact:"chef1@ecole.cd",role:"Chef d'établissement",equipe:null,statut:"actif",identifiant:"chef",motDePasse:"chef123",ecoleId:"eco-001",telephone:"+243810002603",createdAt:"2022-10-10T08:00:00.000Z"},{id:"usr-011",nom:"Chef Établissement Patrick Ilunga",contact:"chef2@ecole.cd",role:"Chef d'établissement",equipe:null,statut:"actif",identifiant:"chef2",motDePasse:"chef123",ecoleId:"eco-002",telephone:"+243810002740",createdAt:"2022-11-10T08:00:00.000Z"},{id:"usr-012",nom:"Chef Établissement Grace Mwamba",contact:"chef3@ecole.cd",role:"Chef d'établissement",equipe:null,statut:"inactif",identifiant:"chef3",motDePasse:"chef123",ecoleId:"eco-003",telephone:null,createdAt:"2022-12-10T08:00:00.000Z"},{id:"usr-013",nom:"Superviseur Technique Banza",contact:"super@inspect-san.cd",role:"Administrateur système",equipe:null,statut:"actif",identifiant:"super",motDePasse:"super123",telephone:"+243810003014",createdAt:"2022-01-10T08:00:00.000Z"},{id:"usr-014",nom:"Directeur Adjoint Kalala",contact:"dpa@inspect-san.cd",role:"Directeur Provincial",equipe:null,statut:"actif",identifiant:"dpa",motDePasse:"dpa123",telephone:"+243810003151",createdAt:"2022-02-10T08:00:00.000Z"},{id:"usr-015",nom:"Contrôleur Senior Cibangu",contact:"ctrl6@inspect-san.cd",role:"Contrôleur",equipe:"Équipe Delta",statut:"actif",identifiant:"controleur6",motDePasse:"ctrl123",telephone:"+243810003288",createdAt:"2022-03-10T08:00:00.000Z"},{id:"usr-016",nom:"Agent Archive Nsenga",contact:"archive@inspect-san.cd",role:"Agent du Secrétariat",equipe:null,statut:"verrouille",identifiant:"archive",motDePasse:"arc123",telephone:"+243810003425",createdAt:"2022-04-10T08:00:00.000Z"}],tt=[{id:"om-001",numero:"OM/PEK-MA/2024/0001",ecoleId:"eco-001",controleurIds:["usr-003"],dateEmission:"2024-01-01T09:00:00.000Z",validiteDebut:"2024-01-01T09:00:00.000Z",validiteFin:"2024-02-15T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2024-01-01T09:00:00.000Z"},{id:"om-002",numero:"OM/PEK-MA/2024/0002",ecoleId:"eco-002",controleurIds:["usr-004","usr-005"],dateEmission:"2024-02-02T09:00:00.000Z",validiteDebut:"2024-02-02T09:00:00.000Z",validiteFin:"2024-03-16T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-02-03T14:00:00.000Z",createdAt:"2024-02-02T09:00:00.000Z"},{id:"om-003",numero:"OM/PEK-MA/2024/0003",ecoleId:"eco-003",controleurIds:["usr-005"],dateEmission:"2024-03-03T09:00:00.000Z",validiteDebut:"2024-03-03T09:00:00.000Z",validiteFin:"2024-04-17T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-03-04T14:00:00.000Z",createdAt:"2024-03-03T09:00:00.000Z"},{id:"om-004",numero:"OM/PEK-MA/2024/0004",ecoleId:"eco-004",controleurIds:["usr-015","usr-003"],dateEmission:"2024-04-04T09:00:00.000Z",validiteDebut:"2024-04-04T09:00:00.000Z",validiteFin:"2024-05-18T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-04-05T14:00:00.000Z",createdAt:"2024-04-04T09:00:00.000Z"},{id:"om-005",numero:"OM/PEK-MA/2024/0005",ecoleId:"eco-005",controleurIds:["usr-003"],dateEmission:"2024-05-05T09:00:00.000Z",validiteDebut:"2024-05-05T09:00:00.000Z",validiteFin:"2024-06-19T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2024-05-05T09:00:00.000Z"},{id:"om-006",numero:"OM/PEK-MA/2024/0006",ecoleId:"eco-006",controleurIds:["usr-004","usr-005","usr-015"],dateEmission:"2024-06-06T09:00:00.000Z",validiteDebut:"2024-06-06T09:00:00.000Z",validiteFin:"2024-07-20T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2024-06-06T09:00:00.000Z"},{id:"om-007",numero:"OM/PEK-MA/2024/0007",ecoleId:"eco-007",controleurIds:["usr-005"],dateEmission:"2024-07-07T09:00:00.000Z",validiteDebut:"2024-07-07T09:00:00.000Z",validiteFin:"2024-08-21T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-07-08T14:00:00.000Z",createdAt:"2024-07-07T09:00:00.000Z"},{id:"om-008",numero:"OM/PEK-MA/2024/0008",ecoleId:"eco-008",controleurIds:["usr-015","usr-003"],dateEmission:"2024-08-08T09:00:00.000Z",validiteDebut:"2024-08-08T09:00:00.000Z",validiteFin:"2024-09-22T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-08-09T14:00:00.000Z",createdAt:"2024-08-08T09:00:00.000Z"},{id:"om-009",numero:"OM/PEK-MA/2024/0009",ecoleId:"eco-009",controleurIds:["usr-003"],dateEmission:"2024-09-09T09:00:00.000Z",validiteDebut:"2024-09-09T09:00:00.000Z",validiteFin:"2024-10-23T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-09-10T14:00:00.000Z",createdAt:"2024-09-09T09:00:00.000Z"},{id:"om-010",numero:"OM/PEK-MA/2024/0010",ecoleId:"eco-010",controleurIds:["usr-004","usr-005"],dateEmission:"2024-10-10T09:00:00.000Z",validiteDebut:"2024-10-10T09:00:00.000Z",validiteFin:"2024-11-24T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2024-10-10T09:00:00.000Z"},{id:"om-011",numero:"OM/PEK-MA/2024/0011",ecoleId:"eco-011",controleurIds:["usr-005"],dateEmission:"2024-11-11T09:00:00.000Z",validiteDebut:"2024-11-11T09:00:00.000Z",validiteFin:"2024-12-15T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2024-11-11T09:00:00.000Z"},{id:"om-012",numero:"OM/PEK-MA/2024/0012",ecoleId:"eco-012",controleurIds:["usr-015","usr-003"],dateEmission:"2024-12-12T09:00:00.000Z",validiteDebut:"2024-12-12T09:00:00.000Z",validiteFin:"2024-01-16T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-12-13T14:00:00.000Z",createdAt:"2024-12-12T09:00:00.000Z"},{id:"om-013",numero:"OM/PEK-MA/2024/0013",ecoleId:"eco-013",controleurIds:["usr-003"],dateEmission:"2024-01-13T09:00:00.000Z",validiteDebut:"2024-01-13T09:00:00.000Z",validiteFin:"2024-02-17T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-01-14T14:00:00.000Z",createdAt:"2024-01-13T09:00:00.000Z"},{id:"om-014",numero:"OM/PEK-MA/2024/0014",ecoleId:"eco-014",controleurIds:["usr-004","usr-005"],dateEmission:"2024-02-14T09:00:00.000Z",validiteDebut:"2024-02-14T09:00:00.000Z",validiteFin:"2024-03-18T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-02-15T14:00:00.000Z",createdAt:"2024-02-14T09:00:00.000Z"},{id:"om-015",numero:"OM/PEK-MA/2024/0015",ecoleId:"eco-015",controleurIds:["usr-005"],dateEmission:"2024-03-15T09:00:00.000Z",validiteDebut:"2024-03-15T09:00:00.000Z",validiteFin:"2024-04-19T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2024-03-15T09:00:00.000Z"},{id:"om-016",numero:"OM/PEK-MA/2024/0016",ecoleId:"eco-016",controleurIds:["usr-015","usr-003"],dateEmission:"2024-04-16T09:00:00.000Z",validiteDebut:"2024-04-16T09:00:00.000Z",validiteFin:"2024-05-20T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2024-04-16T09:00:00.000Z"},{id:"om-017",numero:"OM/PEK-MA/2024/0017",ecoleId:"eco-017",controleurIds:["usr-003"],dateEmission:"2024-05-17T09:00:00.000Z",validiteDebut:"2024-05-17T09:00:00.000Z",validiteFin:"2024-06-21T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-05-18T14:00:00.000Z",createdAt:"2024-05-17T09:00:00.000Z"},{id:"om-018",numero:"OM/PEK-MA/2024/0018",ecoleId:"eco-018",controleurIds:["usr-004","usr-005"],dateEmission:"2024-06-18T09:00:00.000Z",validiteDebut:"2024-06-18T09:00:00.000Z",validiteFin:"2024-07-22T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-06-19T14:00:00.000Z",createdAt:"2024-06-18T09:00:00.000Z"},{id:"om-019",numero:"OM/PEK-MA/2024/0019",ecoleId:"eco-019",controleurIds:["usr-005"],dateEmission:"2024-07-19T09:00:00.000Z",validiteDebut:"2024-07-19T09:00:00.000Z",validiteFin:"2024-08-23T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-07-20T14:00:00.000Z",createdAt:"2024-07-19T09:00:00.000Z"},{id:"om-020",numero:"OM/PEK-MA/2024/0020",ecoleId:"eco-020",controleurIds:["usr-015","usr-003"],dateEmission:"2024-08-20T09:00:00.000Z",validiteDebut:"2024-08-20T09:00:00.000Z",validiteFin:"2024-09-24T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2024-08-20T09:00:00.000Z"},{id:"om-021",numero:"OM/PEK-MA/2024/0021",ecoleId:"eco-021",controleurIds:["usr-003"],dateEmission:"2024-09-21T09:00:00.000Z",validiteDebut:"2024-09-21T09:00:00.000Z",validiteFin:"2024-10-15T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2024-09-21T09:00:00.000Z"},{id:"om-022",numero:"OM/PEK-MA/2024/0022",ecoleId:"eco-022",controleurIds:["usr-004","usr-005"],dateEmission:"2024-10-22T09:00:00.000Z",validiteDebut:"2024-10-22T09:00:00.000Z",validiteFin:"2024-11-16T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-10-23T14:00:00.000Z",createdAt:"2024-10-22T09:00:00.000Z"},{id:"om-023",numero:"OM/PEK-MA/2024/0023",ecoleId:"eco-023",controleurIds:["usr-005"],dateEmission:"2024-11-23T09:00:00.000Z",validiteDebut:"2024-11-23T09:00:00.000Z",validiteFin:"2024-12-17T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-11-24T14:00:00.000Z",createdAt:"2024-11-23T09:00:00.000Z"},{id:"om-024",numero:"OM/PEK-MA/2024/0024",ecoleId:"eco-024",controleurIds:["usr-015","usr-003"],dateEmission:"2024-12-24T09:00:00.000Z",validiteDebut:"2024-12-24T09:00:00.000Z",validiteFin:"2024-01-18T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-12-25T14:00:00.000Z",createdAt:"2024-12-24T09:00:00.000Z"},{id:"om-025",numero:"OM/PEK-MA/2024/0025",ecoleId:"eco-025",controleurIds:["usr-003"],dateEmission:"2024-01-25T09:00:00.000Z",validiteDebut:"2024-01-25T09:00:00.000Z",validiteFin:"2024-02-19T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2024-01-25T09:00:00.000Z"},{id:"om-026",numero:"OM/PEK-MA/2024/0026",ecoleId:"eco-026",controleurIds:["usr-004","usr-005"],dateEmission:"2024-02-26T09:00:00.000Z",validiteDebut:"2024-02-26T09:00:00.000Z",validiteFin:"2024-03-20T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2024-02-26T09:00:00.000Z"},{id:"om-027",numero:"OM/PEK-MA/2024/0027",ecoleId:"eco-027",controleurIds:["usr-005"],dateEmission:"2024-03-27T09:00:00.000Z",validiteDebut:"2024-03-27T09:00:00.000Z",validiteFin:"2024-04-21T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-03-03T14:00:00.000Z",createdAt:"2024-03-27T09:00:00.000Z"},{id:"om-028",numero:"OM/PEK-MA/2024/0028",ecoleId:"eco-028",controleurIds:["usr-015","usr-003"],dateEmission:"2024-04-01T09:00:00.000Z",validiteDebut:"2024-04-01T09:00:00.000Z",validiteFin:"2024-05-22T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-04-04T14:00:00.000Z",createdAt:"2024-04-01T09:00:00.000Z"},{id:"om-029",numero:"OM/PEK-MA/2024/0029",ecoleId:"eco-029",controleurIds:["usr-003"],dateEmission:"2024-05-02T09:00:00.000Z",validiteDebut:"2024-05-02T09:00:00.000Z",validiteFin:"2024-06-23T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-05-05T14:00:00.000Z",createdAt:"2024-05-02T09:00:00.000Z"},{id:"om-030",numero:"OM/PEK-MA/2024/0030",ecoleId:"eco-030",controleurIds:["usr-004","usr-005"],dateEmission:"2024-06-03T09:00:00.000Z",validiteDebut:"2024-06-03T09:00:00.000Z",validiteFin:"2024-07-24T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2024-06-03T09:00:00.000Z"},{id:"om-031",numero:"OM/PEK-MA/2024/0031",ecoleId:"eco-031",controleurIds:["usr-005"],dateEmission:"2025-07-04T09:00:00.000Z",validiteDebut:"2025-07-04T09:00:00.000Z",validiteFin:"2025-08-15T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2025-07-04T09:00:00.000Z"},{id:"om-032",numero:"OM/PEK-MA/2024/0032",ecoleId:"eco-032",controleurIds:["usr-015","usr-003"],dateEmission:"2025-08-05T09:00:00.000Z",validiteDebut:"2025-08-05T09:00:00.000Z",validiteFin:"2025-09-16T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-08-08T14:00:00.000Z",createdAt:"2025-08-05T09:00:00.000Z"},{id:"om-033",numero:"OM/PEK-MA/2024/0033",ecoleId:"eco-033",controleurIds:["usr-003"],dateEmission:"2025-09-06T09:00:00.000Z",validiteDebut:"2025-09-06T09:00:00.000Z",validiteFin:"2025-10-17T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-09-09T14:00:00.000Z",createdAt:"2025-09-06T09:00:00.000Z"},{id:"om-034",numero:"OM/PEK-MA/2024/0034",ecoleId:"eco-034",controleurIds:["usr-004","usr-005"],dateEmission:"2025-10-07T09:00:00.000Z",validiteDebut:"2025-10-07T09:00:00.000Z",validiteFin:"2025-11-18T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-10-10T14:00:00.000Z",createdAt:"2025-10-07T09:00:00.000Z"},{id:"om-035",numero:"OM/PEK-MA/2024/0035",ecoleId:"eco-035",controleurIds:["usr-005"],dateEmission:"2025-11-08T09:00:00.000Z",validiteDebut:"2025-11-08T09:00:00.000Z",validiteFin:"2025-12-19T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2025-11-08T09:00:00.000Z"},{id:"om-036",numero:"OM/PEK-MA/2024/0036",ecoleId:"eco-036",controleurIds:["usr-015","usr-003"],dateEmission:"2025-12-09T09:00:00.000Z",validiteDebut:"2025-12-09T09:00:00.000Z",validiteFin:"2025-01-20T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2025-12-09T09:00:00.000Z"},{id:"om-037",numero:"OM/PEK-MA/2024/0037",ecoleId:"eco-037",controleurIds:["usr-003"],dateEmission:"2025-01-10T09:00:00.000Z",validiteDebut:"2025-01-10T09:00:00.000Z",validiteFin:"2025-02-21T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-01-13T14:00:00.000Z",createdAt:"2025-01-10T09:00:00.000Z"},{id:"om-038",numero:"OM/PEK-MA/2024/0038",ecoleId:"eco-038",controleurIds:["usr-004","usr-005"],dateEmission:"2025-02-11T09:00:00.000Z",validiteDebut:"2025-02-11T09:00:00.000Z",validiteFin:"2025-03-22T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-02-14T14:00:00.000Z",createdAt:"2025-02-11T09:00:00.000Z"},{id:"om-039",numero:"OM/PEK-MA/2024/0039",ecoleId:"eco-039",controleurIds:["usr-005"],dateEmission:"2025-03-12T09:00:00.000Z",validiteDebut:"2025-03-12T09:00:00.000Z",validiteFin:"2025-04-23T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-03-15T14:00:00.000Z",createdAt:"2025-03-12T09:00:00.000Z"},{id:"om-040",numero:"OM/PEK-MA/2024/0040",ecoleId:"eco-040",controleurIds:["usr-015","usr-003"],dateEmission:"2025-04-13T09:00:00.000Z",validiteDebut:"2025-04-13T09:00:00.000Z",validiteFin:"2025-05-24T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2025-04-13T09:00:00.000Z"},{id:"om-041",numero:"OM/PEK-MA/2024/0041",ecoleId:"eco-041",controleurIds:["usr-003"],dateEmission:"2025-05-14T09:00:00.000Z",validiteDebut:"2025-05-14T09:00:00.000Z",validiteFin:"2025-06-15T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2025-05-14T09:00:00.000Z"},{id:"om-042",numero:"OM/PEK-MA/2024/0042",ecoleId:"eco-042",controleurIds:["usr-004","usr-005"],dateEmission:"2025-06-15T09:00:00.000Z",validiteDebut:"2025-06-15T09:00:00.000Z",validiteFin:"2025-07-16T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-06-18T14:00:00.000Z",createdAt:"2025-06-15T09:00:00.000Z"},{id:"om-043",numero:"OM/PEK-MA/2024/0043",ecoleId:"eco-001",controleurIds:["usr-005"],dateEmission:"2025-07-16T09:00:00.000Z",validiteDebut:"2025-07-16T09:00:00.000Z",validiteFin:"2025-08-17T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-07-19T14:00:00.000Z",createdAt:"2025-07-16T09:00:00.000Z"},{id:"om-044",numero:"OM/PEK-MA/2024/0044",ecoleId:"eco-002",controleurIds:["usr-015","usr-003"],dateEmission:"2025-08-17T09:00:00.000Z",validiteDebut:"2025-08-17T09:00:00.000Z",validiteFin:"2025-09-18T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-08-20T14:00:00.000Z",createdAt:"2025-08-17T09:00:00.000Z"},{id:"om-045",numero:"OM/PEK-MA/2024/0045",ecoleId:"eco-003",controleurIds:["usr-003"],dateEmission:"2025-09-18T09:00:00.000Z",validiteDebut:"2025-09-18T09:00:00.000Z",validiteFin:"2025-10-19T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2025-09-18T09:00:00.000Z"},{id:"om-046",numero:"OM/PEK-MA/2024/0046",ecoleId:"eco-004",controleurIds:["usr-004","usr-005"],dateEmission:"2025-10-19T09:00:00.000Z",validiteDebut:"2025-10-19T09:00:00.000Z",validiteFin:"2025-11-20T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2025-10-19T09:00:00.000Z"},{id:"om-047",numero:"OM/PEK-MA/2024/0047",ecoleId:"eco-005",controleurIds:["usr-005"],dateEmission:"2025-11-20T09:00:00.000Z",validiteDebut:"2025-11-20T09:00:00.000Z",validiteFin:"2025-12-21T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-11-23T14:00:00.000Z",createdAt:"2025-11-20T09:00:00.000Z"},{id:"om-048",numero:"OM/PEK-MA/2024/0048",ecoleId:"eco-006",controleurIds:["usr-015","usr-003"],dateEmission:"2025-12-21T09:00:00.000Z",validiteDebut:"2025-12-21T09:00:00.000Z",validiteFin:"2025-01-22T17:00:00.000Z",statut:"en_cours",signePar:"usr-002",signeLe:"2024-12-24T14:00:00.000Z",createdAt:"2025-12-21T09:00:00.000Z"},{id:"om-049",numero:"OM/PEK-MA/2024/0049",ecoleId:"eco-007",controleurIds:["usr-003"],dateEmission:"2025-01-22T09:00:00.000Z",validiteDebut:"2025-01-22T09:00:00.000Z",validiteFin:"2025-02-23T17:00:00.000Z",statut:"cloture",signePar:"usr-002",signeLe:"2024-01-25T14:00:00.000Z",createdAt:"2025-01-22T09:00:00.000Z"},{id:"om-050",numero:"OM/PEK-MA/2024/0050",ecoleId:"eco-008",controleurIds:["usr-004","usr-005"],dateEmission:"2025-02-23T09:00:00.000Z",validiteDebut:"2025-02-23T09:00:00.000Z",validiteFin:"2025-03-24T17:00:00.000Z",statut:"annule",signePar:null,signeLe:null,createdAt:"2025-02-23T09:00:00.000Z"},{id:"om-051",numero:"OM/PEK-MA/2024/0051",ecoleId:"eco-009",controleurIds:["usr-005"],dateEmission:"2025-03-24T09:00:00.000Z",validiteDebut:"2025-03-24T09:00:00.000Z",validiteFin:"2025-04-15T17:00:00.000Z",statut:"en_attente_signature",signePar:null,signeLe:null,createdAt:"2025-03-24T09:00:00.000Z"},{id:"om-052",numero:"OM/PEK-MA/2024/0052",ecoleId:"eco-010",controleurIds:["usr-015","usr-003"],dateEmission:"2025-04-25T09:00:00.000Z",validiteDebut:"2025-04-25T09:00:00.000Z",validiteFin:"2025-05-16T17:00:00.000Z",statut:"signe",signePar:"usr-002",signeLe:"2024-04-03T14:00:00.000Z",createdAt:"2025-04-25T09:00:00.000Z"}],it=[{id:"fc-001",numero:"FC/2024/0001",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:1,toilettesGarcons:1,nombreEleves:80},sectionImpact7:{montantPercu:5e4,produitsNettoyage:[],quantite:"10 unités"},observations:"Observation contrôle n°1 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-01-03T08:00:00.000Z",updatedAt:"2024-01-04T08:00:00.000Z"},{id:"fc-002",numero:"FC/2024/0002",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:2,toilettesGarcons:2,nombreEleves:97},sectionImpact7:{montantPercu:63e3,produitsNettoyage:["Javel","Savon"],quantite:"11 unités"},observations:"Observation contrôle n°2 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-2-1",nom:"toilettes_2.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-02-04T08:00:00.000Z",updatedAt:"2024-02-05T08:00:00.000Z"},{id:"fc-003",numero:"FC/2024/0003",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"validee",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:3,toilettesGarcons:3,nombreEleves:114},sectionImpact7:{montantPercu:76e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"12 unités"},observations:"Observation contrôle n°3 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-3-1",nom:"toilettes_3.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-3-2",nom:"cour_3.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-04-07T11:00:00.000Z",createdAt:"2023-03-05T08:00:00.000Z",updatedAt:"2024-03-06T08:00:00.000Z"},{id:"fc-004",numero:"FC/2024/0004",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"brouillon",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:4,toilettesGarcons:4,nombreEleves:131},sectionImpact7:{montantPercu:89e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"13 unités"},observations:"Observation contrôle n°4 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-04-06T08:00:00.000Z",updatedAt:"2024-04-07T08:00:00.000Z"},{id:"fc-005",numero:"FC/2024/0005",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:5,toilettesGarcons:5,nombreEleves:148},sectionImpact7:{montantPercu:102e3,produitsNettoyage:[],quantite:"14 unités"},observations:"Observation contrôle n°5 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-5-1",nom:"toilettes_5.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-5-2",nom:"cour_5.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-05-07T08:00:00.000Z",updatedAt:"2024-05-08T08:00:00.000Z"},{id:"fc-006",numero:"FC/2024/0006",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:6,toilettesGarcons:1,nombreEleves:165},sectionImpact7:{montantPercu:115e3,produitsNettoyage:["Javel","Savon"],quantite:"15 unités"},observations:"Observation contrôle n°6 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-6-1",nom:"toilettes_6.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-07-10T11:00:00.000Z",createdAt:"2023-06-08T08:00:00.000Z",updatedAt:"2024-06-09T08:00:00.000Z"},{id:"fc-007",numero:"FC/2024/0007",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:1,toilettesGarcons:2,nombreEleves:182},sectionImpact7:{montantPercu:128e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"16 unités"},observations:"Observation contrôle n°7 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-07-09T08:00:00.000Z",updatedAt:"2024-07-10T08:00:00.000Z"},{id:"fc-008",numero:"FC/2024/0008",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:2,toilettesGarcons:3,nombreEleves:199},sectionImpact7:{montantPercu:141e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"17 unités"},observations:"Observation contrôle n°8 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-8-1",nom:"toilettes_8.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-08-10T08:00:00.000Z",updatedAt:"2024-08-11T08:00:00.000Z"},{id:"fc-009",numero:"FC/2024/0009",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"validee",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:3,toilettesGarcons:4,nombreEleves:216},sectionImpact7:{montantPercu:154e3,produitsNettoyage:[],quantite:"18 unités"},observations:"Observation contrôle n°9 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-9-1",nom:"toilettes_9.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-9-2",nom:"cour_9.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-10-13T11:00:00.000Z",createdAt:"2023-09-11T08:00:00.000Z",updatedAt:"2024-09-12T08:00:00.000Z"},{id:"fc-010",numero:"FC/2024/0010",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"brouillon",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:4,toilettesGarcons:5,nombreEleves:233},sectionImpact7:{montantPercu:167e3,produitsNettoyage:["Javel","Savon"],quantite:"19 unités"},observations:"Observation contrôle n°10 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-10-12T08:00:00.000Z",updatedAt:"2024-10-13T08:00:00.000Z"},{id:"fc-011",numero:"FC/2024/0011",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:5,toilettesGarcons:1,nombreEleves:250},sectionImpact7:{montantPercu:18e4,produitsNettoyage:["Javel","Savon","Balais"],quantite:"20 unités"},observations:"Observation contrôle n°11 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-11-1",nom:"toilettes_11.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-11-2",nom:"cour_11.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-11-13T08:00:00.000Z",updatedAt:"2024-11-14T08:00:00.000Z"},{id:"fc-012",numero:"FC/2024/0012",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:6,toilettesGarcons:2,nombreEleves:267},sectionImpact7:{montantPercu:193e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"21 unités"},observations:"Observation contrôle n°12 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-12-1",nom:"toilettes_12.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-03-16T11:00:00.000Z",createdAt:"2023-12-14T08:00:00.000Z",updatedAt:"2024-12-15T08:00:00.000Z"},{id:"fc-013",numero:"FC/2024/0013",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"brouillon",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:1,toilettesGarcons:3,nombreEleves:284},sectionImpact7:{montantPercu:206e3,produitsNettoyage:[],quantite:"22 unités"},observations:"Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : Observations détaillées : L'établissement présente des manquements majeurs en hygiène, assainissement et gestion des latrines. Les recommandations portent sur la réhabilitation urgente des blocs sanitaires, l'approvisionnement régulier en produits de nettoyage financés par les 7 %, la formation du personnel d'entretien et la mise en place d'un comité d'hygiène scolaire. Un suivi rapproché est indispensable dans les 30 jours.",recommandationPreliminaire:"Maintien avec recommandations",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-01-15T08:00:00.000Z",updatedAt:"2024-01-16T08:00:00.000Z"},{id:"fc-014",numero:"FC/2024/0014",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:2,toilettesGarcons:4,nombreEleves:301},sectionImpact7:{montantPercu:219e3,produitsNettoyage:["Javel","Savon"],quantite:"23 unités"},observations:"Observation contrôle n°14 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-14-1",nom:"toilettes_14.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-02-16T08:00:00.000Z",updatedAt:"2024-02-17T08:00:00.000Z"},{id:"fc-015",numero:"FC/2024/0015",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"validee",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:3,toilettesGarcons:5,nombreEleves:318},sectionImpact7:{montantPercu:232e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"24 unités"},observations:"Observation contrôle n°15 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-15-1",nom:"toilettes_15.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-15-2",nom:"cour_15.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-06-19T11:00:00.000Z",createdAt:"2023-03-17T08:00:00.000Z",updatedAt:"2024-03-18T08:00:00.000Z"},{id:"fc-016",numero:"FC/2024/0016",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:4,toilettesGarcons:1,nombreEleves:335},sectionImpact7:{montantPercu:245e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"25 unités"},observations:"Observation contrôle n°16 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-04-18T08:00:00.000Z",updatedAt:"2024-04-19T08:00:00.000Z"},{id:"fc-017",numero:"FC/2024/0017",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:5,toilettesGarcons:2,nombreEleves:352},sectionImpact7:{montantPercu:258e3,produitsNettoyage:[],quantite:"26 unités"},observations:"Observation contrôle n°17 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-17-1",nom:"toilettes_17.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-17-2",nom:"cour_17.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-05-19T08:00:00.000Z",updatedAt:"2024-05-20T08:00:00.000Z"},{id:"fc-018",numero:"FC/2024/0018",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"validee",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:6,toilettesGarcons:3,nombreEleves:369},sectionImpact7:{montantPercu:271e3,produitsNettoyage:["Javel","Savon"],quantite:"27 unités"},observations:"Observation contrôle n°18 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-18-1",nom:"toilettes_18.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-09-22T11:00:00.000Z",createdAt:"2023-06-20T08:00:00.000Z",updatedAt:"2024-06-21T08:00:00.000Z"},{id:"fc-019",numero:"FC/2024/0019",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"brouillon",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:1,toilettesGarcons:4,nombreEleves:386},sectionImpact7:{montantPercu:284e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"28 unités"},observations:"Observation contrôle n°19 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-07-21T08:00:00.000Z",updatedAt:"2024-07-22T08:00:00.000Z"},{id:"fc-020",numero:"FC/2024/0020",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:2,toilettesGarcons:5,nombreEleves:403},sectionImpact7:{montantPercu:297e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"29 unités"},observations:"Observation contrôle n°20 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-20-1",nom:"toilettes_20.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-08-22T08:00:00.000Z",updatedAt:"2024-08-23T08:00:00.000Z"},{id:"fc-021",numero:"FC/2024/0021",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:3,toilettesGarcons:1,nombreEleves:420},sectionImpact7:{montantPercu:31e4,produitsNettoyage:[],quantite:"30 unités"},observations:"Observation contrôle n°21 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-21-1",nom:"toilettes_21.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-21-2",nom:"cour_21.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-02-05T11:00:00.000Z",createdAt:"2023-09-23T08:00:00.000Z",updatedAt:"2024-09-04T08:00:00.000Z"},{id:"fc-022",numero:"FC/2024/0022",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:4,toilettesGarcons:2,nombreEleves:437},sectionImpact7:{montantPercu:323e3,produitsNettoyage:["Javel","Savon"],quantite:"31 unités"},observations:"Observation contrôle n°22 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-10-24T08:00:00.000Z",updatedAt:"2024-10-05T08:00:00.000Z"},{id:"fc-023",numero:"FC/2024/0023",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:5,toilettesGarcons:3,nombreEleves:454},sectionImpact7:{montantPercu:336e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"32 unités"},observations:"Observation contrôle n°23 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-23-1",nom:"toilettes_23.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-23-2",nom:"cour_23.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-11-25T08:00:00.000Z",updatedAt:"2024-11-06T08:00:00.000Z"},{id:"fc-024",numero:"FC/2024/0024",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"validee",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:6,toilettesGarcons:4,nombreEleves:471},sectionImpact7:{montantPercu:349e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"33 unités"},observations:"Observation contrôle n°24 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-24-1",nom:"toilettes_24.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-05-08T11:00:00.000Z",createdAt:"2023-12-26T08:00:00.000Z",updatedAt:"2024-12-07T08:00:00.000Z"},{id:"fc-025",numero:"FC/2024/0025",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"brouillon",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:1,toilettesGarcons:5,nombreEleves:488},sectionImpact7:{montantPercu:362e3,produitsNettoyage:[],quantite:"34 unités"},observations:"Observation contrôle n°25 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-01-27T08:00:00.000Z",updatedAt:"2024-01-08T08:00:00.000Z"},{id:"fc-026",numero:"FC/2024/0026",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:2,toilettesGarcons:1,nombreEleves:505},sectionImpact7:{montantPercu:375e3,produitsNettoyage:["Javel","Savon"],quantite:"35 unités"},observations:"Observation contrôle n°26 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-26-1",nom:"toilettes_26.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-02-03T08:00:00.000Z",updatedAt:"2024-02-09T08:00:00.000Z"},{id:"fc-027",numero:"FC/2024/0027",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:3,toilettesGarcons:2,nombreEleves:522},sectionImpact7:{montantPercu:388e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"36 unités"},observations:"Observation contrôle n°27 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-27-1",nom:"toilettes_27.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-27-2",nom:"cour_27.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-08-11T11:00:00.000Z",createdAt:"2023-03-04T08:00:00.000Z",updatedAt:"2024-03-10T08:00:00.000Z"},{id:"fc-028",numero:"FC/2024/0028",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"brouillon",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:4,toilettesGarcons:3,nombreEleves:539},sectionImpact7:{montantPercu:401e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"37 unités"},observations:"Observation contrôle n°28 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-04-05T08:00:00.000Z",updatedAt:"2024-04-11T08:00:00.000Z"},{id:"fc-029",numero:"FC/2024/0029",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:5,toilettesGarcons:4,nombreEleves:556},sectionImpact7:{montantPercu:414e3,produitsNettoyage:[],quantite:"38 unités"},observations:"Observation contrôle n°29 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-29-1",nom:"toilettes_29.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-29-2",nom:"cour_29.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-05-06T08:00:00.000Z",updatedAt:"2024-05-12T08:00:00.000Z"},{id:"fc-030",numero:"FC/2024/0030",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"validee",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:6,toilettesGarcons:5,nombreEleves:573},sectionImpact7:{montantPercu:427e3,produitsNettoyage:["Javel","Savon"],quantite:"39 unités"},observations:"Observation contrôle n°30 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-30-1",nom:"toilettes_30.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-11-14T11:00:00.000Z",createdAt:"2023-06-07T08:00:00.000Z",updatedAt:"2024-06-13T08:00:00.000Z"},{id:"fc-031",numero:"FC/2024/0031",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:1,toilettesGarcons:1,nombreEleves:590},sectionImpact7:{montantPercu:44e4,produitsNettoyage:["Javel","Savon","Balais"],quantite:"40 unités"},observations:"Observation contrôle n°31 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-07-08T08:00:00.000Z",updatedAt:"2024-07-14T08:00:00.000Z"},{id:"fc-032",numero:"FC/2024/0032",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:2,toilettesGarcons:2,nombreEleves:607},sectionImpact7:{montantPercu:453e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"41 unités"},observations:"Observation contrôle n°32 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-32-1",nom:"toilettes_32.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-08-09T08:00:00.000Z",updatedAt:"2024-08-15T08:00:00.000Z"},{id:"fc-033",numero:"FC/2024/0033",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"validee",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:3,toilettesGarcons:3,nombreEleves:624},sectionImpact7:{montantPercu:466e3,produitsNettoyage:[],quantite:"42 unités"},observations:"Observation contrôle n°33 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-33-1",nom:"toilettes_33.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-33-2",nom:"cour_33.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-04-17T11:00:00.000Z",createdAt:"2023-09-10T08:00:00.000Z",updatedAt:"2024-09-16T08:00:00.000Z"},{id:"fc-034",numero:"FC/2024/0034",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"brouillon",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:4,toilettesGarcons:4,nombreEleves:641},sectionImpact7:{montantPercu:479e3,produitsNettoyage:["Javel","Savon"],quantite:"43 unités"},observations:"Observation contrôle n°34 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-10-11T08:00:00.000Z",updatedAt:"2024-10-17T08:00:00.000Z"},{id:"fc-035",numero:"FC/2024/0035",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:5,toilettesGarcons:5,nombreEleves:658},sectionImpact7:{montantPercu:492e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"44 unités"},observations:"Observation contrôle n°35 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-35-1",nom:"toilettes_35.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-35-2",nom:"cour_35.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-11-12T08:00:00.000Z",updatedAt:"2024-11-18T08:00:00.000Z"},{id:"fc-036",numero:"FC/2024/0036",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:6,toilettesGarcons:1,nombreEleves:675},sectionImpact7:{montantPercu:505e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"45 unités"},observations:"Observation contrôle n°36 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-36-1",nom:"toilettes_36.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-07-20T11:00:00.000Z",createdAt:"2023-12-13T08:00:00.000Z",updatedAt:"2024-12-19T08:00:00.000Z"},{id:"fc-037",numero:"FC/2024/0037",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:1,toilettesGarcons:2,nombreEleves:692},sectionImpact7:{montantPercu:518e3,produitsNettoyage:[],quantite:"46 unités"},observations:"Observation contrôle n°37 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-01-14T08:00:00.000Z",updatedAt:"2024-01-20T08:00:00.000Z"},{id:"fc-038",numero:"FC/2024/0038",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:2,toilettesGarcons:3,nombreEleves:709},sectionImpact7:{montantPercu:531e3,produitsNettoyage:["Javel","Savon"],quantite:"47 unités"},observations:"Observation contrôle n°38 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-38-1",nom:"toilettes_38.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2023-02-15T08:00:00.000Z",updatedAt:"2024-02-21T08:00:00.000Z"},{id:"fc-039",numero:"FC/2024/0039",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"validee",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:3,toilettesGarcons:4,nombreEleves:726},sectionImpact7:{montantPercu:544e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"48 unités"},observations:"Observation contrôle n°39 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-39-1",nom:"toilettes_39.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-39-2",nom:"cour_39.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-10-23T11:00:00.000Z",createdAt:"2023-03-16T08:00:00.000Z",updatedAt:"2024-03-22T08:00:00.000Z"},{id:"fc-040",numero:"FC/2024/0040",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"brouillon",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:4,toilettesGarcons:5,nombreEleves:743},sectionImpact7:{montantPercu:57e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"49 unités"},observations:"Observation contrôle n°40 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[],valideePar:null,valideeLe:null,createdAt:"2023-04-17T08:00:00.000Z",updatedAt:"2024-04-23T08:00:00.000Z"},{id:"fc-041",numero:"FC/2024/0041",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:5,toilettesGarcons:1,nombreEleves:760},sectionImpact7:{montantPercu:7e4,produitsNettoyage:[],quantite:"10 unités"},observations:"Observation contrôle n°41 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-41-1",nom:"toilettes_41.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-41-2",nom:"cour_41.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-05-18T08:00:00.000Z",updatedAt:"2024-05-04T08:00:00.000Z"},{id:"fc-042",numero:"FC/2024/0042",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:6,toilettesGarcons:2,nombreEleves:777},sectionImpact7:{montantPercu:83e3,produitsNettoyage:["Javel","Savon"],quantite:"11 unités"},observations:"Observation contrôle n°42 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-42-1",nom:"toilettes_42.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-03-06T11:00:00.000Z",createdAt:"2024-06-19T08:00:00.000Z",updatedAt:"2024-06-05T08:00:00.000Z"},{id:"fc-043",numero:"FC/2024/0043",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"brouillon",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:1,toilettesGarcons:3,nombreEleves:794},sectionImpact7:{montantPercu:96e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"12 unités"},observations:"Observation contrôle n°43 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-07-20T08:00:00.000Z",updatedAt:"2024-07-06T08:00:00.000Z"},{id:"fc-044",numero:"FC/2024/0044",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:2,toilettesGarcons:4,nombreEleves:811},sectionImpact7:{montantPercu:109e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"13 unités"},observations:"Observation contrôle n°44 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-44-1",nom:"toilettes_44.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-08-21T08:00:00.000Z",updatedAt:"2024-08-07T08:00:00.000Z"},{id:"fc-045",numero:"FC/2024/0045",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"validee",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:3,toilettesGarcons:5,nombreEleves:828},sectionImpact7:{montantPercu:122e3,produitsNettoyage:[],quantite:"14 unités"},observations:"Observation contrôle n°45 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-45-1",nom:"toilettes_45.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-45-2",nom:"cour_45.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-06-09T11:00:00.000Z",createdAt:"2024-09-22T08:00:00.000Z",updatedAt:"2024-09-08T08:00:00.000Z"},{id:"fc-046",numero:"FC/2024/0046",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:4,toilettesGarcons:1,nombreEleves:845},sectionImpact7:{montantPercu:135e3,produitsNettoyage:["Javel","Savon"],quantite:"15 unités"},observations:"Observation contrôle n°46 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-10-23T08:00:00.000Z",updatedAt:"2024-10-09T08:00:00.000Z"},{id:"fc-047",numero:"FC/2024/0047",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:5,toilettesGarcons:2,nombreEleves:862},sectionImpact7:{montantPercu:148e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"16 unités"},observations:"Observation contrôle n°47 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-47-1",nom:"toilettes_47.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-47-2",nom:"cour_47.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-11-24T08:00:00.000Z",updatedAt:"2024-11-10T08:00:00.000Z"},{id:"fc-048",numero:"FC/2024/0048",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"validee",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:6,toilettesGarcons:3,nombreEleves:879},sectionImpact7:{montantPercu:161e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"17 unités"},observations:"Observation contrôle n°48 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-48-1",nom:"toilettes_48.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-09-12T11:00:00.000Z",createdAt:"2024-12-25T08:00:00.000Z",updatedAt:"2024-12-11T08:00:00.000Z"},{id:"fc-049",numero:"FC/2024/0049",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"brouillon",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:1,toilettesGarcons:4,nombreEleves:896},sectionImpact7:{montantPercu:174e3,produitsNettoyage:[],quantite:"18 unités"},observations:"Observation contrôle n°49 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-01-26T08:00:00.000Z",updatedAt:"2024-01-12T08:00:00.000Z"},{id:"fc-050",numero:"FC/2024/0050",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:2,toilettesGarcons:5,nombreEleves:913},sectionImpact7:{montantPercu:187e3,produitsNettoyage:["Javel","Savon"],quantite:"19 unités"},observations:"Observation contrôle n°50 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-50-1",nom:"toilettes_50.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-02-27T08:00:00.000Z",updatedAt:"2024-02-13T08:00:00.000Z"},{id:"fc-051",numero:"FC/2024/0051",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:3,toilettesGarcons:1,nombreEleves:930},sectionImpact7:{montantPercu:2e5,produitsNettoyage:["Javel","Savon","Balais"],quantite:"20 unités"},observations:"Observation contrôle n°51 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-51-1",nom:"toilettes_51.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-51-2",nom:"cour_51.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-02-15T11:00:00.000Z",createdAt:"2024-03-03T08:00:00.000Z",updatedAt:"2024-03-14T08:00:00.000Z"},{id:"fc-052",numero:"FC/2024/0052",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:4,toilettesGarcons:2,nombreEleves:947},sectionImpact7:{montantPercu:213e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"21 unités"},observations:"Observation contrôle n°52 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-04-04T08:00:00.000Z",updatedAt:"2024-04-15T08:00:00.000Z"},{id:"fc-053",numero:"FC/2024/0053",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:5,toilettesGarcons:3,nombreEleves:964},sectionImpact7:{montantPercu:226e3,produitsNettoyage:[],quantite:"22 unités"},observations:"Observation contrôle n°53 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-53-1",nom:"toilettes_53.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-53-2",nom:"cour_53.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-05-05T08:00:00.000Z",updatedAt:"2024-05-16T08:00:00.000Z"},{id:"fc-054",numero:"FC/2024/0054",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"validee",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:6,toilettesGarcons:4,nombreEleves:81},sectionImpact7:{montantPercu:239e3,produitsNettoyage:["Javel","Savon"],quantite:"23 unités"},observations:"Observation contrôle n°54 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-54-1",nom:"toilettes_54.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-05-18T11:00:00.000Z",createdAt:"2024-06-06T08:00:00.000Z",updatedAt:"2024-06-17T08:00:00.000Z"},{id:"fc-055",numero:"FC/2024/0055",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"brouillon",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:1,toilettesGarcons:5,nombreEleves:98},sectionImpact7:{montantPercu:252e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"24 unités"},observations:"Observation contrôle n°55 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-07-07T08:00:00.000Z",updatedAt:"2024-07-18T08:00:00.000Z"},{id:"fc-056",numero:"FC/2024/0056",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:2,toilettesGarcons:1,nombreEleves:115},sectionImpact7:{montantPercu:265e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"25 unités"},observations:"Observation contrôle n°56 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-56-1",nom:"toilettes_56.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-08-08T08:00:00.000Z",updatedAt:"2024-08-19T08:00:00.000Z"},{id:"fc-057",numero:"FC/2024/0057",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:3,toilettesGarcons:2,nombreEleves:132},sectionImpact7:{montantPercu:278e3,produitsNettoyage:[],quantite:"26 unités"},observations:"Observation contrôle n°57 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-57-1",nom:"toilettes_57.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-57-2",nom:"cour_57.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-08-21T11:00:00.000Z",createdAt:"2024-09-09T08:00:00.000Z",updatedAt:"2024-09-20T08:00:00.000Z"},{id:"fc-058",numero:"FC/2024/0058",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"brouillon",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:4,toilettesGarcons:3,nombreEleves:149},sectionImpact7:{montantPercu:291e3,produitsNettoyage:["Javel","Savon"],quantite:"27 unités"},observations:"Observation contrôle n°58 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-10-10T08:00:00.000Z",updatedAt:"2024-10-21T08:00:00.000Z"},{id:"fc-059",numero:"FC/2024/0059",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:5,toilettesGarcons:4,nombreEleves:166},sectionImpact7:{montantPercu:304e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"28 unités"},observations:"Observation contrôle n°59 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-59-1",nom:"toilettes_59.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-59-2",nom:"cour_59.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-11-11T08:00:00.000Z",updatedAt:"2024-11-22T08:00:00.000Z"},{id:"fc-060",numero:"FC/2024/0060",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"validee",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:6,toilettesGarcons:5,nombreEleves:183},sectionImpact7:{montantPercu:317e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"29 unités"},observations:"Observation contrôle n°60 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-60-1",nom:"toilettes_60.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-11-24T11:00:00.000Z",createdAt:"2024-12-12T08:00:00.000Z",updatedAt:"2024-12-23T08:00:00.000Z"},{id:"fc-061",numero:"FC/2024/0061",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:1,toilettesGarcons:1,nombreEleves:200},sectionImpact7:{montantPercu:33e4,produitsNettoyage:[],quantite:"30 unités"},observations:"Observation contrôle n°61 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-01-13T08:00:00.000Z",updatedAt:"2024-01-04T08:00:00.000Z"},{id:"fc-062",numero:"FC/2024/0062",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:2,toilettesGarcons:2,nombreEleves:217},sectionImpact7:{montantPercu:343e3,produitsNettoyage:["Javel","Savon"],quantite:"31 unités"},observations:"Observation contrôle n°62 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-62-1",nom:"toilettes_62.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-02-14T08:00:00.000Z",updatedAt:"2024-02-05T08:00:00.000Z"},{id:"fc-063",numero:"FC/2024/0063",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"validee",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:3,toilettesGarcons:3,nombreEleves:234},sectionImpact7:{montantPercu:356e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"32 unités"},observations:"Observation contrôle n°63 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-63-1",nom:"toilettes_63.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-63-2",nom:"cour_63.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-04-07T11:00:00.000Z",createdAt:"2024-03-15T08:00:00.000Z",updatedAt:"2024-03-06T08:00:00.000Z"},{id:"fc-064",numero:"FC/2024/0064",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"brouillon",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:4,toilettesGarcons:4,nombreEleves:251},sectionImpact7:{montantPercu:369e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"33 unités"},observations:"Observation contrôle n°64 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-04-16T08:00:00.000Z",updatedAt:"2024-04-07T08:00:00.000Z"},{id:"fc-065",numero:"FC/2024/0065",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:1,etatGeneral:"Bon",toilettesFilles:5,toilettesGarcons:5,nombreEleves:268},sectionImpact7:{montantPercu:382e3,produitsNettoyage:[],quantite:"34 unités"},observations:"Observation contrôle n°65 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-65-1",nom:"toilettes_65.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-65-2",nom:"cour_65.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-05-17T08:00:00.000Z",updatedAt:"2024-05-08T08:00:00.000Z"},{id:"fc-066",numero:"FC/2024/0066",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:2,etatGeneral:"Moyen",toilettesFilles:6,toilettesGarcons:1,nombreEleves:285},sectionImpact7:{montantPercu:395e3,produitsNettoyage:["Javel","Savon"],quantite:"35 unités"},observations:"Observation contrôle n°66 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[{id:"ph-66-1",nom:"toilettes_66.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-07-10T11:00:00.000Z",createdAt:"2024-06-18T08:00:00.000Z",updatedAt:"2024-06-09T08:00:00.000Z"},{id:"fc-067",numero:"FC/2024/0067",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"brouillon",sectionBatiments:{nombreBatiments:3,etatGeneral:"Dégradé",toilettesFilles:1,toilettesGarcons:2,nombreEleves:302},sectionImpact7:{montantPercu:408e3,produitsNettoyage:["Javel","Savon","Balais"],quantite:"36 unités"},observations:"Observation contrôle n°67 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-07-19T08:00:00.000Z",updatedAt:"2024-07-10T08:00:00.000Z"},{id:"fc-068",numero:"FC/2024/0068",ordreMissionId:"om-003",ecoleId:"eco-003",chefId:"chef-003",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:4,etatGeneral:"Critique",toilettesFilles:2,toilettesGarcons:3,nombreEleves:319},sectionImpact7:{montantPercu:421e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"37 unités"},observations:"Observation contrôle n°68 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-68-1",nom:"toilettes_68.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-08-20T08:00:00.000Z",updatedAt:"2024-08-11T08:00:00.000Z"},{id:"fc-069",numero:"FC/2024/0069",ordreMissionId:"om-004",ecoleId:"eco-004",chefId:"chef-004",statut:"validee",sectionBatiments:{nombreBatiments:5,etatGeneral:"Bon",toilettesFilles:3,toilettesGarcons:4,nombreEleves:336},sectionImpact7:{montantPercu:434e3,produitsNettoyage:[],quantite:"38 unités"},observations:"Observation contrôle n°69 : état général bon.",recommandationPreliminaire:"Maintien avec recommandations",photos:[{id:"ph-69-1",nom:"toilettes_69.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-69-2",nom:"cour_69.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:"usr-010",valideeLe:"2024-10-13T11:00:00.000Z",createdAt:"2024-09-21T08:00:00.000Z",updatedAt:"2024-09-12T08:00:00.000Z"},{id:"fc-070",numero:"FC/2024/0070",ordreMissionId:"om-007",ecoleId:"eco-007",chefId:"chef-007",statut:"brouillon",sectionBatiments:{nombreBatiments:6,etatGeneral:"Moyen",toilettesFilles:4,toilettesGarcons:5,nombreEleves:353},sectionImpact7:{montantPercu:447e3,produitsNettoyage:["Javel","Savon"],quantite:"39 unités"},observations:"Observation contrôle n°70 : état général moyen.",recommandationPreliminaire:"Réhabilitation partielle",photos:[],valideePar:null,valideeLe:null,createdAt:"2024-10-22T08:00:00.000Z",updatedAt:"2024-10-13T08:00:00.000Z"},{id:"fc-071",numero:"FC/2024/0071",ordreMissionId:"om-002",ecoleId:"eco-004",chefId:"chef-004",statut:"en_attente_validation",sectionBatiments:{nombreBatiments:7,etatGeneral:"Dégradé",toilettesFilles:5,toilettesGarcons:1,nombreEleves:370},sectionImpact7:{montantPercu:46e4,produitsNettoyage:["Javel","Savon","Balais"],quantite:"40 unités"},observations:"Observation contrôle n°71 : état général dégradé.",recommandationPreliminaire:"Fermeture temporaire proposée",photos:[{id:"ph-71-1",nom:"toilettes_71.jpg",url:"/assets/images/avatar/avatar-1.jpg"},{id:"ph-71-2",nom:"cour_71.jpg",url:"/assets/images/avatar/avatar-2.jpg"}],valideePar:null,valideeLe:null,createdAt:"2024-11-23T08:00:00.000Z",updatedAt:"2024-11-14T08:00:00.000Z"},{id:"fc-072",numero:"FC/2024/0072",ordreMissionId:"om-002",ecoleId:"eco-002",chefId:"chef-002",statut:"validee",sectionBatiments:{nombreBatiments:8,etatGeneral:"Critique",toilettesFilles:6,toilettesGarcons:2,nombreEleves:387},sectionImpact7:{montantPercu:473e3,produitsNettoyage:["Javel","Savon","Balais","Seaux"],quantite:"41 unités"},observations:"Observation contrôle n°72 : état général critique.",recommandationPreliminaire:"Suivi renforcé",photos:[{id:"ph-72-1",nom:"toilettes_72.jpg",url:"/assets/images/avatar/avatar-1.jpg"}],valideePar:"usr-010",valideeLe:"2024-03-16T11:00:00.000Z",createdAt:"2024-12-24T08:00:00.000Z",updatedAt:"2024-12-15T08:00:00.000Z"}],at=[{id:"rap-001",numero:"RAP/PEK-MA/2024/0001",ficheIds:["fc-003","fc-006","fc-009"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°1 portant sur 3 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-02-01T08:00:00.000Z"},{id:"rap-002",numero:"RAP/PEK-MA/2024/0002",ficheIds:["fc-006"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°2 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-04-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-03-02T08:00:00.000Z"},{id:"rap-003",numero:"RAP/PEK-MA/2024/0003",ficheIds:["fc-009"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°3 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"recu",deposeLe:"2024-05-05T10:00:00.000Z",deposePar:"usr-005",accuseReceptionLe:"2024-05-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:null,createdAt:"2024-04-03T08:00:00.000Z"},{id:"rap-004",numero:"RAP/PEK-MA/2024/0004",ficheIds:["fc-012"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°4 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"transmis",deposeLe:"2024-06-05T10:00:00.000Z",deposePar:"usr-015",accuseReceptionLe:"2024-06-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-06-07T09:00:00.000Z",createdAt:"2024-05-04T08:00:00.000Z"},{id:"rap-005",numero:"RAP/PEK-MA/2024/0005",ficheIds:["fc-015"],ecoleId:"eco-007",synthese:"Synthèse d'inspection n°5 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"traite",deposeLe:"2024-07-05T10:00:00.000Z",deposePar:"usr-003",accuseReceptionLe:"2024-07-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-07-07T09:00:00.000Z",createdAt:"2024-06-05T08:00:00.000Z"},{id:"rap-006",numero:"RAP/PEK-MA/2024/0006",ficheIds:["fc-018"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°6 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-07-06T08:00:00.000Z"},{id:"rap-007",numero:"RAP/PEK-MA/2024/0007",ficheIds:["fc-021"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°7 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-09-05T10:00:00.000Z",deposePar:"usr-005",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-08-07T08:00:00.000Z"},{id:"rap-008",numero:"RAP/PEK-MA/2024/0008",ficheIds:["fc-024"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°8 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"recu",deposeLe:"2024-10-05T10:00:00.000Z",deposePar:"usr-015",accuseReceptionLe:"2024-10-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:null,createdAt:"2024-09-08T08:00:00.000Z"},{id:"rap-009",numero:"RAP/PEK-MA/2024/0009",ficheIds:["fc-027"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°9 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"transmis",deposeLe:"2024-03-05T10:00:00.000Z",deposePar:"usr-003",accuseReceptionLe:"2024-03-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-03-07T09:00:00.000Z",createdAt:"2024-10-09T08:00:00.000Z"},{id:"rap-010",numero:"RAP/PEK-MA/2024/0010",ficheIds:["fc-030"],ecoleId:"eco-007",synthese:"Synthèse d'inspection n°10 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"traite",deposeLe:"2024-04-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:"2024-04-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-04-07T09:00:00.000Z",createdAt:"2024-11-10T08:00:00.000Z"},{id:"rap-011",numero:"RAP/PEK-MA/2024/0011",ficheIds:["fc-033"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°11 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-02-11T08:00:00.000Z"},{id:"rap-012",numero:"RAP/PEK-MA/2024/0012",ficheIds:["fc-036"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°12 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-06-05T10:00:00.000Z",deposePar:"usr-015",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-03-12T08:00:00.000Z"},{id:"rap-013",numero:"RAP/PEK-MA/2024/0013",ficheIds:["fc-039"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°13 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"recu",deposeLe:"2024-07-05T10:00:00.000Z",deposePar:"usr-003",accuseReceptionLe:"2024-07-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:null,createdAt:"2024-04-13T08:00:00.000Z"},{id:"rap-014",numero:"RAP/PEK-MA/2024/0014",ficheIds:["fc-042"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°14 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"transmis",deposeLe:"2024-08-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:"2024-08-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-08-07T09:00:00.000Z",createdAt:"2024-05-14T08:00:00.000Z"},{id:"rap-015",numero:"RAP/PEK-MA/2024/0015",ficheIds:["fc-045"],ecoleId:"eco-007",synthese:"Synthèse d'inspection n°15 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"traite",deposeLe:"2024-09-05T10:00:00.000Z",deposePar:"usr-005",accuseReceptionLe:"2024-09-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-09-07T09:00:00.000Z",createdAt:"2024-06-15T08:00:00.000Z"},{id:"rap-016",numero:"RAP/PEK-MA/2024/0016",ficheIds:["fc-048"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°16 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-07-16T08:00:00.000Z"},{id:"rap-017",numero:"RAP/PEK-MA/2024/0017",ficheIds:["fc-051"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°17 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-03-05T10:00:00.000Z",deposePar:"usr-003",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-08-17T08:00:00.000Z"},{id:"rap-018",numero:"RAP/PEK-MA/2024/0018",ficheIds:["fc-054"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°18 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"recu",deposeLe:"2024-04-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:"2024-04-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:null,createdAt:"2024-09-18T08:00:00.000Z"},{id:"rap-019",numero:"RAP/PEK-MA/2024/0019",ficheIds:["fc-057"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°19 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"transmis",deposeLe:"2024-05-05T10:00:00.000Z",deposePar:"usr-005",accuseReceptionLe:"2024-05-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-05-07T09:00:00.000Z",createdAt:"2024-10-19T08:00:00.000Z"},{id:"rap-020",numero:"RAP/PEK-MA/2024/0020",ficheIds:["fc-060"],ecoleId:"eco-007",synthese:"Synthèse d'inspection n°20 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"traite",deposeLe:"2024-06-05T10:00:00.000Z",deposePar:"usr-015",accuseReceptionLe:"2024-06-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-06-07T09:00:00.000Z",createdAt:"2024-11-20T08:00:00.000Z"},{id:"rap-021",numero:"RAP/PEK-MA/2024/0021",ficheIds:["fc-063"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°21 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-02-01T08:00:00.000Z"},{id:"rap-022",numero:"RAP/PEK-MA/2024/0022",ficheIds:["fc-066"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°22 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-08-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-03-02T08:00:00.000Z"},{id:"rap-023",numero:"RAP/PEK-MA/2024/0023",ficheIds:["fc-069"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°23 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"recu",deposeLe:"2024-09-05T10:00:00.000Z",deposePar:"usr-005",accuseReceptionLe:"2024-09-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:null,createdAt:"2024-04-03T08:00:00.000Z"},{id:"rap-024",numero:"RAP/PEK-MA/2024/0024",ficheIds:["fc-072"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°24 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"transmis",deposeLe:"2024-10-05T10:00:00.000Z",deposePar:"usr-015",accuseReceptionLe:"2024-10-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-10-07T09:00:00.000Z",createdAt:"2024-05-04T08:00:00.000Z"},{id:"rap-025",numero:"RAP/PEK-MA/2024/0025",ficheIds:["fc-003"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°25 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"traite",deposeLe:"2024-03-05T10:00:00.000Z",deposePar:"usr-003",accuseReceptionLe:"2024-03-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-03-07T09:00:00.000Z",createdAt:"2024-06-05T08:00:00.000Z"},{id:"rap-026",numero:"RAP/PEK-MA/2024/0026",ficheIds:["fc-006"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°26 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-07-06T08:00:00.000Z"},{id:"rap-027",numero:"RAP/PEK-MA/2024/0027",ficheIds:["fc-009"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°27 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-05-05T10:00:00.000Z",deposePar:"usr-005",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-08-07T08:00:00.000Z"},{id:"rap-028",numero:"RAP/PEK-MA/2024/0028",ficheIds:["fc-012"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°28 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"recu",deposeLe:"2024-06-05T10:00:00.000Z",deposePar:"usr-015",accuseReceptionLe:"2024-06-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:null,createdAt:"2024-09-08T08:00:00.000Z"},{id:"rap-029",numero:"RAP/PEK-MA/2024/0029",ficheIds:["fc-015"],ecoleId:"eco-007",synthese:"Synthèse d'inspection n°29 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"transmis",deposeLe:"2024-07-05T10:00:00.000Z",deposePar:"usr-003",accuseReceptionLe:"2024-07-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-07-07T09:00:00.000Z",createdAt:"2024-10-09T08:00:00.000Z"},{id:"rap-030",numero:"RAP/PEK-MA/2024/0030",ficheIds:["fc-018"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°30 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"traite",deposeLe:"2024-08-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:"2024-08-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-08-07T09:00:00.000Z",createdAt:"2024-11-10T08:00:00.000Z"},{id:"rap-031",numero:"RAP/PEK-MA/2024/0031",ficheIds:["fc-021"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°31 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-02-11T08:00:00.000Z"},{id:"rap-032",numero:"RAP/PEK-MA/2024/0032",ficheIds:["fc-024"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°32 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-10-05T10:00:00.000Z",deposePar:"usr-015",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-03-12T08:00:00.000Z"},{id:"rap-033",numero:"RAP/PEK-MA/2024/0033",ficheIds:["fc-027"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°33 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"recu",deposeLe:"2024-03-05T10:00:00.000Z",deposePar:"usr-003",accuseReceptionLe:"2024-03-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:null,createdAt:"2024-04-13T08:00:00.000Z"},{id:"rap-034",numero:"RAP/PEK-MA/2024/0034",ficheIds:["fc-030"],ecoleId:"eco-007",synthese:"Synthèse d'inspection n°34 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"transmis",deposeLe:"2024-04-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:"2024-04-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-04-07T09:00:00.000Z",createdAt:"2024-05-14T08:00:00.000Z"},{id:"rap-035",numero:"RAP/PEK-MA/2024/0035",ficheIds:["fc-033"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°35 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"traite",deposeLe:"2024-05-05T10:00:00.000Z",deposePar:"usr-005",accuseReceptionLe:"2024-05-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-05-07T09:00:00.000Z",createdAt:"2024-06-15T08:00:00.000Z"},{id:"rap-036",numero:"RAP/PEK-MA/2024/0036",ficheIds:["fc-036"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°36 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-07-16T08:00:00.000Z"},{id:"rap-037",numero:"RAP/PEK-MA/2024/0037",ficheIds:["fc-039"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°37 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-07-05T10:00:00.000Z",deposePar:"usr-003",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-08-17T08:00:00.000Z"},{id:"rap-038",numero:"RAP/PEK-MA/2024/0038",ficheIds:["fc-042"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°38 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"recu",deposeLe:"2024-08-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:"2024-08-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:null,createdAt:"2024-09-18T08:00:00.000Z"},{id:"rap-039",numero:"RAP/PEK-MA/2024/0039",ficheIds:["fc-045"],ecoleId:"eco-007",synthese:"Synthèse d'inspection n°39 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"transmis",deposeLe:"2024-09-05T10:00:00.000Z",deposePar:"usr-005",accuseReceptionLe:"2024-09-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-09-07T09:00:00.000Z",createdAt:"2024-10-19T08:00:00.000Z"},{id:"rap-040",numero:"RAP/PEK-MA/2024/0040",ficheIds:["fc-048"],ecoleId:"eco-003",synthese:"Synthèse d'inspection n°40 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"traite",deposeLe:"2024-10-05T10:00:00.000Z",deposePar:"usr-015",accuseReceptionLe:"2024-10-06T14:00:00.000Z",accusePar:"usr-008",transmisLe:"2024-10-07T09:00:00.000Z",createdAt:"2024-11-20T08:00:00.000Z"},{id:"rap-041",numero:"RAP/PEK-MA/2024/0041",ficheIds:["fc-051"],ecoleId:"eco-002",synthese:"Synthèse d'inspection n°41 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-02-01T08:00:00.000Z"},{id:"rap-042",numero:"RAP/PEK-MA/2024/0042",ficheIds:["fc-054"],ecoleId:"eco-004",synthese:"Synthèse d'inspection n°42 portant sur 1 fiche(s) de contrôle. Conformité partielle observée.",statut:"depose",deposeLe:"2024-04-05T10:00:00.000Z",deposePar:"usr-004",accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:"2024-03-02T08:00:00.000Z"}],nt=[{id:"dec-001",numero:"DEC/2024/0001",rapportId:"rap-004",ecoleId:"eco-002",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0004.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-04-02T15:00:00.000Z",createdAt:"2024-04-01T08:00:00.000Z"},{id:"dec-002",numero:"DEC/2024/0002",rapportId:"rap-005",ecoleId:"eco-007",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0005.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-05-03T15:00:00.000Z",createdAt:"2024-05-02T08:00:00.000Z"},{id:"dec-003",numero:"DEC/2024/0003",rapportId:"rap-009",ecoleId:"eco-002",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0009.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-06-04T15:00:00.000Z",createdAt:"2024-06-03T08:00:00.000Z"},{id:"dec-004",numero:"DEC/2024/0004",rapportId:"rap-010",ecoleId:"eco-007",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0010.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-07-05T15:00:00.000Z",createdAt:"2024-07-04T08:00:00.000Z"},{id:"dec-005",numero:"DEC/2024/0005",rapportId:"rap-014",ecoleId:"eco-002",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0014.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-08-06T15:00:00.000Z",createdAt:"2024-08-05T08:00:00.000Z"},{id:"dec-006",numero:"DEC/2024/0006",rapportId:"rap-015",ecoleId:"eco-007",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0015.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-09-07T15:00:00.000Z",createdAt:"2024-09-06T08:00:00.000Z"},{id:"dec-007",numero:"DEC/2024/0007",rapportId:"rap-019",ecoleId:"eco-002",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0019.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-10-08T15:00:00.000Z",createdAt:"2024-10-07T08:00:00.000Z"},{id:"dec-008",numero:"DEC/2024/0008",rapportId:"rap-020",ecoleId:"eco-007",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0020.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-11-09T15:00:00.000Z",createdAt:"2024-11-08T08:00:00.000Z"},{id:"dec-009",numero:"DEC/2024/0009",rapportId:"rap-024",ecoleId:"eco-002",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0024.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-04-10T15:00:00.000Z",createdAt:"2024-04-09T08:00:00.000Z"},{id:"dec-010",numero:"DEC/2024/0010",rapportId:"rap-025",ecoleId:"eco-003",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0025.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-05-11T15:00:00.000Z",createdAt:"2024-05-10T08:00:00.000Z"},{id:"dec-011",numero:"DEC/2024/0011",rapportId:"rap-029",ecoleId:"eco-007",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0029.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-06-12T15:00:00.000Z",createdAt:"2024-06-11T08:00:00.000Z"},{id:"dec-012",numero:"DEC/2024/0012",rapportId:"rap-030",ecoleId:"eco-003",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0030.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-07-13T15:00:00.000Z",createdAt:"2024-07-12T08:00:00.000Z"},{id:"dec-013",numero:"DEC/2024/0013",rapportId:"rap-034",ecoleId:"eco-007",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0034.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-08-14T15:00:00.000Z",createdAt:"2024-08-13T08:00:00.000Z"},{id:"dec-014",numero:"DEC/2024/0014",rapportId:"rap-035",ecoleId:"eco-003",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0035.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-09-15T15:00:00.000Z",createdAt:"2024-09-14T08:00:00.000Z"},{id:"dec-015",numero:"DEC/2024/0015",rapportId:"rap-039",ecoleId:"eco-007",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0039.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-10-16T15:00:00.000Z",createdAt:"2024-10-15T08:00:00.000Z"},{id:"dec-016",numero:"DEC/2024/0016",rapportId:"rap-040",ecoleId:"eco-003",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0040.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-11-17T15:00:00.000Z",createdAt:"2024-11-16T08:00:00.000Z"},{id:"dec-017",numero:"DEC/2024/0017",rapportId:"rap-004",ecoleId:"eco-002",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0004.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-04-18T15:00:00.000Z",createdAt:"2024-04-17T08:00:00.000Z"},{id:"dec-018",numero:"DEC/2024/0018",rapportId:"rap-005",ecoleId:"eco-007",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0005.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-05-19T15:00:00.000Z",createdAt:"2024-05-18T08:00:00.000Z"},{id:"dec-019",numero:"DEC/2024/0019",rapportId:"rap-009",ecoleId:"eco-002",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0009.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-06-20T15:00:00.000Z",createdAt:"2024-06-19T08:00:00.000Z"},{id:"dec-020",numero:"DEC/2024/0020",rapportId:"rap-010",ecoleId:"eco-007",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0010.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-07-21T15:00:00.000Z",createdAt:"2024-07-20T08:00:00.000Z"},{id:"dec-021",numero:"DEC/2024/0021",rapportId:"rap-014",ecoleId:"eco-002",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0014.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-08-02T15:00:00.000Z",createdAt:"2024-08-01T08:00:00.000Z"},{id:"dec-022",numero:"DEC/2024/0022",rapportId:"rap-015",ecoleId:"eco-007",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0015.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-09-03T15:00:00.000Z",createdAt:"2024-09-02T08:00:00.000Z"},{id:"dec-023",numero:"DEC/2024/0023",rapportId:"rap-019",ecoleId:"eco-002",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0019.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-10-04T15:00:00.000Z",createdAt:"2024-10-03T08:00:00.000Z"},{id:"dec-024",numero:"DEC/2024/0024",rapportId:"rap-020",ecoleId:"eco-007",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0020.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-11-05T15:00:00.000Z",createdAt:"2024-11-04T08:00:00.000Z"},{id:"dec-025",numero:"DEC/2024/0025",rapportId:"rap-024",ecoleId:"eco-002",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0024.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-04-06T15:00:00.000Z",createdAt:"2024-04-05T08:00:00.000Z"},{id:"dec-026",numero:"DEC/2024/0026",rapportId:"rap-025",ecoleId:"eco-003",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0025.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-05-07T15:00:00.000Z",createdAt:"2024-05-06T08:00:00.000Z"},{id:"dec-027",numero:"DEC/2024/0027",rapportId:"rap-029",ecoleId:"eco-007",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0029.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-06-08T15:00:00.000Z",createdAt:"2024-06-07T08:00:00.000Z"},{id:"dec-028",numero:"DEC/2024/0028",rapportId:"rap-030",ecoleId:"eco-003",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0030.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-07-09T15:00:00.000Z",createdAt:"2024-07-08T08:00:00.000Z"},{id:"dec-029",numero:"DEC/2024/0029",rapportId:"rap-034",ecoleId:"eco-007",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0034.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-08-10T15:00:00.000Z",createdAt:"2024-08-09T08:00:00.000Z"},{id:"dec-030",numero:"DEC/2024/0030",rapportId:"rap-035",ecoleId:"eco-003",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0035.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-09-11T15:00:00.000Z",createdAt:"2024-09-10T08:00:00.000Z"},{id:"dec-031",numero:"DEC/2024/0031",rapportId:"rap-039",ecoleId:"eco-007",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0039.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-10-12T15:00:00.000Z",createdAt:"2024-10-11T08:00:00.000Z"},{id:"dec-032",numero:"DEC/2024/0032",rapportId:"rap-040",ecoleId:"eco-003",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0040.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-11-13T15:00:00.000Z",createdAt:"2024-11-12T08:00:00.000Z"},{id:"dec-033",numero:"DEC/2024/0033",rapportId:"rap-004",ecoleId:"eco-002",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0004.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-04-14T15:00:00.000Z",createdAt:"2024-04-13T08:00:00.000Z"},{id:"dec-034",numero:"DEC/2024/0034",rapportId:"rap-005",ecoleId:"eco-007",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0005.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-05-15T15:00:00.000Z",createdAt:"2024-05-14T08:00:00.000Z"},{id:"dec-035",numero:"DEC/2024/0035",rapportId:"rap-009",ecoleId:"eco-002",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0009.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-06-16T15:00:00.000Z",createdAt:"2024-06-15T08:00:00.000Z"},{id:"dec-036",numero:"DEC/2024/0036",rapportId:"rap-010",ecoleId:"eco-007",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0010.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-07-17T15:00:00.000Z",createdAt:"2024-07-16T08:00:00.000Z"},{id:"dec-037",numero:"DEC/2024/0037",rapportId:"rap-014",ecoleId:"eco-002",type:"maintien",delaiExecution:"7 jours",commentaire:"Décision maintien suite au rapport RAP/PEK-MA/2024/0014.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-08-18T15:00:00.000Z",createdAt:"2024-08-17T08:00:00.000Z"},{id:"dec-038",numero:"DEC/2024/0038",rapportId:"rap-015",ecoleId:"eco-007",type:"rehabilitation",delaiExecution:"14 jours",commentaire:"Décision rehabilitation suite au rapport RAP/PEK-MA/2024/0015.",statutExecution:"executee",decidePar:"usr-002",decideLe:"2024-09-19T15:00:00.000Z",createdAt:"2024-09-18T08:00:00.000Z"},{id:"dec-039",numero:"DEC/2024/0039",rapportId:"rap-019",ecoleId:"eco-002",type:"fermeture_temporaire",delaiExecution:"21 jours",commentaire:"Décision fermeture temporaire suite au rapport RAP/PEK-MA/2024/0019.",statutExecution:"non_executee",decidePar:"usr-002",decideLe:"2024-10-20T15:00:00.000Z",createdAt:"2024-10-19T08:00:00.000Z"},{id:"dec-040",numero:"DEC/2024/0040",rapportId:"rap-020",ecoleId:"eco-007",type:"fermeture_definitive",delaiExecution:"28 jours",commentaire:"Décision fermeture definitive suite au rapport RAP/PEK-MA/2024/0020.",statutExecution:"en_cours",decidePar:"usr-002",decideLe:"2024-11-21T15:00:00.000Z",createdAt:"2024-11-20T08:00:00.000Z"}],ot=[{id:"ntf-001",type:"signature",titre:"Ordre de mission signé",message:"Notification automatique n°1 — événement « signature » simulé dans Inspect-San.",lu:!0,userId:"usr-001",createdAt:"2024-05-01T08:00:00.000Z"},{id:"ntf-002",type:"depot",titre:"Rapport déposé au secrétariat",message:"Notification automatique n°2 — événement « depot » simulé dans Inspect-San.",lu:!1,userId:"usr-002",createdAt:"2024-06-02T09:00:00.000Z"},{id:"ntf-003",type:"decision",titre:"Nouvelle décision prise",message:"Notification automatique n°3 — événement « decision » simulé dans Inspect-San.",lu:!1,userId:"usr-003",createdAt:"2024-07-03T10:00:00.000Z"},{id:"ntf-004",type:"alerte",titre:"Alerte de conformité",message:"Notification automatique n°4 — événement « alerte » simulé dans Inspect-San.",lu:!0,userId:"usr-004",createdAt:"2024-08-04T11:00:00.000Z"},{id:"ntf-005",type:"validation",titre:"Fiche de contrôle validée",message:"Notification automatique n°5 — événement « validation » simulé dans Inspect-San.",lu:!1,userId:"usr-005",createdAt:"2024-09-05T12:00:00.000Z"},{id:"ntf-006",type:"transmission",titre:"Rapport transmis au Directeur Provincial",message:"Notification automatique n°6 — événement « transmission » simulé dans Inspect-San.",lu:!1,userId:"usr-006",createdAt:"2024-10-06T13:00:00.000Z"},{id:"ntf-007",type:"signature",titre:"Ordre de mission signé",message:"Notification automatique n°7 — événement « signature » simulé dans Inspect-San.",lu:!0,userId:"usr-007",createdAt:"2024-05-07T14:00:00.000Z"},{id:"ntf-008",type:"depot",titre:"Rapport déposé au secrétariat",message:"Notification automatique n°8 — événement « depot » simulé dans Inspect-San.",lu:!1,userId:"usr-008",createdAt:"2024-06-08T15:00:00.000Z"},{id:"ntf-009",type:"decision",titre:"Nouvelle décision prise",message:"Notification automatique n°9 — événement « decision » simulé dans Inspect-San.",lu:!1,userId:"usr-009",createdAt:"2024-07-09T16:00:00.000Z"},{id:"ntf-010",type:"alerte",titre:"Alerte de conformité",message:"Notification automatique n°10 — événement « alerte » simulé dans Inspect-San.",lu:!0,userId:"usr-010",createdAt:"2024-08-10T17:00:00.000Z"},{id:"ntf-011",type:"validation",titre:"Fiche de contrôle validée",message:"Notification automatique n°11 — événement « validation » simulé dans Inspect-San.",lu:!1,userId:"usr-011",createdAt:"2024-09-11T08:00:00.000Z"},{id:"ntf-012",type:"transmission",titre:"Rapport transmis au Directeur Provincial",message:"Notification automatique n°12 — événement « transmission » simulé dans Inspect-San.",lu:!1,userId:"usr-012",createdAt:"2024-10-12T09:00:00.000Z"},{id:"ntf-013",type:"signature",titre:"Ordre de mission signé",message:"Notification automatique n°13 — événement « signature » simulé dans Inspect-San.",lu:!0,userId:"usr-013",createdAt:"2024-05-13T10:00:00.000Z"},{id:"ntf-014",type:"depot",titre:"Rapport déposé au secrétariat",message:"Notification automatique n°14 — événement « depot » simulé dans Inspect-San.",lu:!1,userId:"usr-014",createdAt:"2024-06-14T11:00:00.000Z"},{id:"ntf-015",type:"decision",titre:"Nouvelle décision prise",message:"Notification automatique n°15 — événement « decision » simulé dans Inspect-San.",lu:!1,userId:"usr-015",createdAt:"2024-07-15T12:00:00.000Z"},{id:"ntf-016",type:"alerte",titre:"Alerte de conformité",message:"Notification automatique n°16 — événement « alerte » simulé dans Inspect-San.",lu:!0,userId:"usr-016",createdAt:"2024-08-16T13:00:00.000Z"},{id:"ntf-017",type:"validation",titre:"Fiche de contrôle validée",message:"Notification automatique n°17 — événement « validation » simulé dans Inspect-San.",lu:!1,userId:"usr-001",createdAt:"2024-09-17T14:00:00.000Z"},{id:"ntf-018",type:"transmission",titre:"Rapport transmis au Directeur Provincial",message:"Notification automatique n°18 — événement « transmission » simulé dans Inspect-San.",lu:!1,userId:"usr-002",createdAt:"2024-10-18T15:00:00.000Z"},{id:"ntf-019",type:"signature",titre:"Ordre de mission signé",message:"Notification automatique n°19 — événement « signature » simulé dans Inspect-San.",lu:!0,userId:"usr-003",createdAt:"2024-05-19T16:00:00.000Z"},{id:"ntf-020",type:"depot",titre:"Rapport déposé au secrétariat",message:"Notification automatique n°20 — événement « depot » simulé dans Inspect-San.",lu:!1,userId:"usr-004",createdAt:"2024-06-20T17:00:00.000Z"},{id:"ntf-021",type:"decision",titre:"Nouvelle décision prise",message:"Notification automatique n°21 — événement « decision » simulé dans Inspect-San.",lu:!1,userId:"usr-005",createdAt:"2024-07-21T08:00:00.000Z"},{id:"ntf-022",type:"alerte",titre:"Alerte de conformité",message:"Notification automatique n°22 — événement « alerte » simulé dans Inspect-San.",lu:!0,userId:"usr-006",createdAt:"2024-08-22T09:00:00.000Z"},{id:"ntf-023",type:"validation",titre:"Fiche de contrôle validée",message:"Notification automatique n°23 — événement « validation » simulé dans Inspect-San.",lu:!1,userId:"usr-007",createdAt:"2024-09-23T10:00:00.000Z"},{id:"ntf-024",type:"transmission",titre:"Rapport transmis au Directeur Provincial",message:"Notification automatique n°24 — événement « transmission » simulé dans Inspect-San.",lu:!1,userId:"usr-008",createdAt:"2024-10-24T11:00:00.000Z"},{id:"ntf-025",type:"signature",titre:"Ordre de mission signé",message:"Notification automatique n°25 — événement « signature » simulé dans Inspect-San.",lu:!0,userId:"usr-009",createdAt:"2024-05-25T12:00:00.000Z"},{id:"ntf-026",type:"depot",titre:"Rapport déposé au secrétariat",message:"Notification automatique n°26 — événement « depot » simulé dans Inspect-San.",lu:!1,userId:"usr-010",createdAt:"2024-06-26T13:00:00.000Z"},{id:"ntf-027",type:"decision",titre:"Nouvelle décision prise",message:"Notification automatique n°27 — événement « decision » simulé dans Inspect-San.",lu:!1,userId:"usr-011",createdAt:"2024-07-27T14:00:00.000Z"},{id:"ntf-028",type:"alerte",titre:"Alerte de conformité",message:"Notification automatique n°28 — événement « alerte » simulé dans Inspect-San.",lu:!0,userId:"usr-012",createdAt:"2024-08-01T15:00:00.000Z"},{id:"ntf-029",type:"validation",titre:"Fiche de contrôle validée",message:"Notification automatique n°29 — événement « validation » simulé dans Inspect-San.",lu:!1,userId:"usr-013",createdAt:"2024-09-02T16:00:00.000Z"},{id:"ntf-030",type:"transmission",titre:"Rapport transmis au Directeur Provincial",message:"Notification automatique n°30 — événement « transmission » simulé dans Inspect-San.",lu:!1,userId:"usr-014",createdAt:"2024-10-03T17:00:00.000Z"},{id:"ntf-031",type:"signature",titre:"Ordre de mission signé",message:"Notification automatique n°31 — événement « signature » simulé dans Inspect-San.",lu:!0,userId:"usr-015",createdAt:"2024-05-04T08:00:00.000Z"},{id:"ntf-032",type:"depot",titre:"Rapport déposé au secrétariat",message:"Notification automatique n°32 — événement « depot » simulé dans Inspect-San.",lu:!1,userId:"usr-016",createdAt:"2024-06-05T09:00:00.000Z"}],st=[{id:"log-001",utilisateurId:"usr-001",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #1",createdAt:"2024-01-01T07:00:00.000Z"},{id:"log-002",utilisateurId:"usr-002",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #2",createdAt:"2024-02-02T08:01:00.000Z"},{id:"log-003",utilisateurId:"usr-003",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #3",createdAt:"2024-03-03T09:02:00.000Z"},{id:"log-004",utilisateurId:"usr-004",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #4",createdAt:"2024-04-04T10:03:00.000Z"},{id:"log-005",utilisateurId:"usr-005",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #5",createdAt:"2024-05-05T11:04:00.000Z"},{id:"log-006",utilisateurId:"usr-006",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #6",createdAt:"2024-06-06T12:05:00.000Z"},{id:"log-007",utilisateurId:"usr-007",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #7",createdAt:"2024-07-07T13:06:00.000Z"},{id:"log-008",utilisateurId:"usr-008",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #8",createdAt:"2024-08-08T14:07:00.000Z"},{id:"log-009",utilisateurId:"usr-009",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #9",createdAt:"2024-09-09T15:08:00.000Z"},{id:"log-010",utilisateurId:"usr-010",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #10",createdAt:"2024-10-10T16:09:00.000Z"},{id:"log-011",utilisateurId:"usr-011",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #11",createdAt:"2024-11-11T17:10:00.000Z"},{id:"log-012",utilisateurId:"usr-012",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #12",createdAt:"2024-12-12T18:11:00.000Z"},{id:"log-013",utilisateurId:"usr-013",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #13",createdAt:"2024-01-13T07:12:00.000Z"},{id:"log-014",utilisateurId:"usr-014",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #14",createdAt:"2024-02-14T08:13:00.000Z"},{id:"log-015",utilisateurId:"usr-015",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #15",createdAt:"2024-03-15T09:14:00.000Z"},{id:"log-016",utilisateurId:"usr-016",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #16",createdAt:"2024-04-16T10:15:00.000Z"},{id:"log-017",utilisateurId:"usr-001",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #17",createdAt:"2024-05-17T11:16:00.000Z"},{id:"log-018",utilisateurId:"usr-002",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #18",createdAt:"2024-06-18T12:17:00.000Z"},{id:"log-019",utilisateurId:"usr-003",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #19",createdAt:"2024-07-19T13:18:00.000Z"},{id:"log-020",utilisateurId:"usr-004",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #20",createdAt:"2024-08-20T14:19:00.000Z"},{id:"log-021",utilisateurId:"usr-005",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #21",createdAt:"2024-09-21T15:20:00.000Z"},{id:"log-022",utilisateurId:"usr-006",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #22",createdAt:"2024-10-22T16:21:00.000Z"},{id:"log-023",utilisateurId:"usr-007",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #23",createdAt:"2024-11-23T17:22:00.000Z"},{id:"log-024",utilisateurId:"usr-008",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #24",createdAt:"2024-12-24T18:23:00.000Z"},{id:"log-025",utilisateurId:"usr-009",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #25",createdAt:"2024-01-25T07:24:00.000Z"},{id:"log-026",utilisateurId:"usr-010",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #26",createdAt:"2024-02-26T08:25:00.000Z"},{id:"log-027",utilisateurId:"usr-011",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #27",createdAt:"2024-03-27T09:26:00.000Z"},{id:"log-028",utilisateurId:"usr-012",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #28",createdAt:"2024-04-01T10:27:00.000Z"},{id:"log-029",utilisateurId:"usr-013",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #29",createdAt:"2024-05-02T11:28:00.000Z"},{id:"log-030",utilisateurId:"usr-014",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #30",createdAt:"2024-06-03T12:29:00.000Z"},{id:"log-031",utilisateurId:"usr-015",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #31",createdAt:"2024-07-04T13:30:00.000Z"},{id:"log-032",utilisateurId:"usr-016",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #32",createdAt:"2024-08-05T14:31:00.000Z"},{id:"log-033",utilisateurId:"usr-001",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #33",createdAt:"2024-09-06T15:32:00.000Z"},{id:"log-034",utilisateurId:"usr-002",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #34",createdAt:"2024-10-07T16:33:00.000Z"},{id:"log-035",utilisateurId:"usr-003",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #35",createdAt:"2024-11-08T17:34:00.000Z"},{id:"log-036",utilisateurId:"usr-004",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #36",createdAt:"2024-12-09T18:35:00.000Z"},{id:"log-037",utilisateurId:"usr-005",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #37",createdAt:"2024-01-10T07:36:00.000Z"},{id:"log-038",utilisateurId:"usr-006",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #38",createdAt:"2024-02-11T08:37:00.000Z"},{id:"log-039",utilisateurId:"usr-007",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #39",createdAt:"2024-03-12T09:38:00.000Z"},{id:"log-040",utilisateurId:"usr-008",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #40",createdAt:"2024-04-13T10:39:00.000Z"},{id:"log-041",utilisateurId:"usr-009",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #41",createdAt:"2024-05-14T11:40:00.000Z"},{id:"log-042",utilisateurId:"usr-010",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #42",createdAt:"2024-06-15T12:41:00.000Z"},{id:"log-043",utilisateurId:"usr-011",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #43",createdAt:"2024-07-16T13:42:00.000Z"},{id:"log-044",utilisateurId:"usr-012",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #44",createdAt:"2024-08-17T14:43:00.000Z"},{id:"log-045",utilisateurId:"usr-013",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #45",createdAt:"2024-09-18T15:44:00.000Z"},{id:"log-046",utilisateurId:"usr-014",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #46",createdAt:"2024-10-19T16:45:00.000Z"},{id:"log-047",utilisateurId:"usr-015",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #47",createdAt:"2024-11-20T17:46:00.000Z"},{id:"log-048",utilisateurId:"usr-016",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #48",createdAt:"2024-12-21T18:47:00.000Z"},{id:"log-049",utilisateurId:"usr-001",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #49",createdAt:"2024-01-22T07:48:00.000Z"},{id:"log-050",utilisateurId:"usr-002",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #50",createdAt:"2024-02-23T08:49:00.000Z"},{id:"log-051",utilisateurId:"usr-003",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #51",createdAt:"2024-03-24T09:50:00.000Z"},{id:"log-052",utilisateurId:"usr-004",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #52",createdAt:"2024-04-25T10:51:00.000Z"},{id:"log-053",utilisateurId:"usr-005",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #53",createdAt:"2024-05-26T11:52:00.000Z"},{id:"log-054",utilisateurId:"usr-006",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #54",createdAt:"2024-06-27T12:53:00.000Z"},{id:"log-055",utilisateurId:"usr-007",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #55",createdAt:"2024-07-01T13:54:00.000Z"},{id:"log-056",utilisateurId:"usr-008",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #56",createdAt:"2024-08-02T14:55:00.000Z"},{id:"log-057",utilisateurId:"usr-009",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #57",createdAt:"2024-09-03T15:56:00.000Z"},{id:"log-058",utilisateurId:"usr-010",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #58",createdAt:"2024-10-04T16:57:00.000Z"},{id:"log-059",utilisateurId:"usr-011",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #59",createdAt:"2024-11-05T17:58:00.000Z"},{id:"log-060",utilisateurId:"usr-012",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #60",createdAt:"2024-12-06T18:59:00.000Z"},{id:"log-061",utilisateurId:"usr-013",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #61",createdAt:"2024-01-07T07:00:00.000Z"},{id:"log-062",utilisateurId:"usr-014",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #62",createdAt:"2024-02-08T08:01:00.000Z"},{id:"log-063",utilisateurId:"usr-015",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #63",createdAt:"2024-03-09T09:02:00.000Z"},{id:"log-064",utilisateurId:"usr-016",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #64",createdAt:"2024-04-10T10:03:00.000Z"},{id:"log-065",utilisateurId:"usr-001",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #65",createdAt:"2024-05-11T11:04:00.000Z"},{id:"log-066",utilisateurId:"usr-002",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #66",createdAt:"2024-06-12T12:05:00.000Z"},{id:"log-067",utilisateurId:"usr-003",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #67",createdAt:"2024-07-13T13:06:00.000Z"},{id:"log-068",utilisateurId:"usr-004",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #68",createdAt:"2024-08-14T14:07:00.000Z"},{id:"log-069",utilisateurId:"usr-005",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #69",createdAt:"2024-09-15T15:08:00.000Z"},{id:"log-070",utilisateurId:"usr-006",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #70",createdAt:"2024-10-16T16:09:00.000Z"},{id:"log-071",utilisateurId:"usr-007",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #71",createdAt:"2024-11-17T17:10:00.000Z"},{id:"log-072",utilisateurId:"usr-008",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #72",createdAt:"2024-12-18T18:11:00.000Z"},{id:"log-073",utilisateurId:"usr-009",module:"Écoles",action:"création",detail:"création sur Écoles — enregistrement #73",createdAt:"2024-01-19T07:12:00.000Z"},{id:"log-074",utilisateurId:"usr-010",module:"Chefs",action:"modification",detail:"modification sur Chefs — enregistrement #74",createdAt:"2024-02-20T08:13:00.000Z"},{id:"log-075",utilisateurId:"usr-011",module:"Utilisateurs",action:"suppression",detail:"suppression sur Utilisateurs — enregistrement #75",createdAt:"2024-03-21T09:14:00.000Z"},{id:"log-076",utilisateurId:"usr-012",module:"Ordres de mission",action:"consultation",detail:"consultation sur Ordres de mission — enregistrement #76",createdAt:"2024-04-22T10:15:00.000Z"},{id:"log-077",utilisateurId:"usr-013",module:"Fiches",action:"signature",detail:"signature sur Fiches — enregistrement #77",createdAt:"2024-05-23T11:16:00.000Z"},{id:"log-078",utilisateurId:"usr-014",module:"Rapports",action:"validation",detail:"validation sur Rapports — enregistrement #78",createdAt:"2024-06-24T12:17:00.000Z"},{id:"log-079",utilisateurId:"usr-015",module:"Décisions",action:"dépôt",detail:"dépôt sur Décisions — enregistrement #79",createdAt:"2024-07-25T13:18:00.000Z"},{id:"log-080",utilisateurId:"usr-016",module:"Paramètres",action:"transmission",detail:"transmission sur Paramètres — enregistrement #80",createdAt:"2024-08-26T14:19:00.000Z"}],rt=[{id:"eq-001",nom:"Équipe Alpha"},{id:"eq-002",nom:"Équipe Beta"},{id:"eq-003",nom:"Équipe Gamma"},{id:"eq-004",nom:"Équipe Delta"}],le=["Administrateur système","Directeur Provincial","Contrôleur","Agent du Secrétariat","Chef d'établissement"],ie={active:"Active",rehabilitation:"Réhabilitation",fermeture_temporaire:"Fermeture temporaire",fermeture_definitive:"Fermeture définitive"},ae={en_attente_signature:"En attente de signature",signe:"Signé",en_cours:"En cours",cloture:"Clôturé",annule:"Annulé"},re={brouillon:"Brouillon",en_attente_validation:"En attente de validation",validee:"Validée (Lu et approuvé)"},ce={brouillon:"Brouillon",depose:"Déposé",recu:"Reçu",transmis:"Transmis",traite:"Traité"},ne={maintien:"Maintien",rehabilitation:"Réhabilitation",fermeture_temporaire:"Fermeture temporaire",fermeture_definitive:"Fermeture définitive"},ue={en_cours:"En cours",executee:"Exécutée",non_executee:"Non exécutée"},me={actif:"Actif",inactif:"Inactif",verrouille:"Verrouillé"},be=10;function _(t){if(!t)return"—";try{return new Date(t).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})}catch{return"—"}}function z(t){if(!t)return"—";try{return new Date(t).toLocaleString("fr-FR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return"—"}}function J(t="id"){return`${t}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}function lt(t,e,n){const a=t.length,c=Math.max(1,Math.ceil(a/n)),r=Math.min(Math.max(1,e),c),o=(r-1)*n;return{items:t.slice(o,o+n),total:a,totalPages:c,page:r,pageSize:n}}function ct(t,e,n="asc"){const a=[...t].sort((c,r)=>{const o=c[e]??"",s=r[e]??"";return typeof o=="number"&&typeof s=="number"?o-s:String(o).localeCompare(String(s),"fr",{sensitivity:"base"})});return n==="desc"?a.reverse():a}function dt(t,e,n="text/plain"){const a=new Blob([e],{type:n}),c=URL.createObjectURL(a),r=document.createElement("a");r.href=c,r.download=t,r.click(),URL.revokeObjectURL(c)}function de(t,e){const n=window.open("","_blank","width=900,height=700");n&&(n.document.write(`<!DOCTYPE html><html lang="fr"><head><title>${t}</title>
    <link rel="stylesheet" href="/assets/css/theme.min.css" />
    <style>body{padding:2rem;font-family:Public Sans,sans-serif} @media print{.no-print{display:none}}</style>
    </head><body>
    <div class="no-print mb-4"><button onclick="window.print()" class="btn btn-primary">Imprimer / PDF</button>
    <button onclick="window.close()" class="btn btn-outline-secondary ms-2">Fermer</button></div>
    ${e}</body></html>`),n.document.close())}const ut={"Administrateur système":["dashboard","ecoles","chefs","utilisateurs","ordres","fiches","rapports","accuses","decisions","statistiques","parametres","journal"],"Directeur Provincial":["dashboard","ordres","rapports","decisions","statistiques"],Contrôleur:["dashboard","ordres","fiches","rapports"],"Agent du Secrétariat":["dashboard","rapports","accuses"],"Chef d'établissement":["dashboard","fiches","ecoles","decisions"]};function Te(t,e){var n;return((n=ut[t])==null?void 0:n.includes(e))??!1}function k(t){return JSON.parse(JSON.stringify(t))}function B(){return new Date().toISOString()}class mt{constructor(){this.listeners=new Set,this.currentUser=null,this.toasts=[],this.ecoles=k(We),this.chefs=k(Xe),this.utilisateurs=k(et),this.ordresMission=k(tt),this.fichesControle=k(it),this.rapports=k(at),this.decisions=k(nt),this.notifications=k(ot),this.journalActivite=k(st),this.communes=k(Ve),this.regimes=k(Ye),this.typesDecision=k(Qe)}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this))}login(e,n){const a=this.utilisateurs.find(c=>c.identifiant===e&&c.motDePasse===n&&c.statut==="actif");return a?(this.currentUser=a,this.addJournal("Authentification","connexion",`Connexion de ${a.nom}`),this.notify(),{ok:!0,user:a}):{ok:!1,error:"Identifiants incorrects ou compte inactif/verrouillé."}}logout(){this.currentUser&&this.addJournal("Authentification","déconnexion",`Déconnexion de ${this.currentUser.nom}`),this.currentUser=null,this.notify()}switchRoleUser(e){const n=this.utilisateurs.find(a=>a.id===e);n&&(this.currentUser=n,this.notify())}pushToast(e,n="success"){const a=J("toast");this.toasts.push({id:a,message:e,type:n}),this.notify(),setTimeout(()=>{this.removeToast(a)},3500)}removeToast(e){this.toasts=this.toasts.filter(n=>n.id!==e),this.notify()}addJournal(e,n,a){var r;const c={id:J("log"),utilisateurId:((r=this.currentUser)==null?void 0:r.id)||"systeme",module:e,action:n,detail:a,createdAt:B()};this.journalActivite.unshift(c),this.notify()}addNotification(e){var a;const n={id:J("ntf"),lu:!1,createdAt:B(),userId:(a=this.currentUser)==null?void 0:a.id,...e};this.notifications.unshift(n),this.notify()}markNotificationRead(e){this.notifications=this.notifications.map(n=>n.id===e?{...n,lu:!0}:n),this.notify()}markAllNotificationsRead(){this.notifications=this.notifications.map(e=>({...e,lu:!0})),this.notify()}upsertEcole(e){if(this.ecoles.some(a=>a.id===e.id))this.ecoles=this.ecoles.map(a=>a.id===e.id?{...a,...e,updatedAt:B()}:a),this.addJournal("Écoles","modification",`École ${e.denomination} modifiée`),this.pushToast("École mise à jour.");else{const a={...e,id:J("eco"),documents:e.documents||[],createdAt:B(),updatedAt:B()};this.ecoles.unshift(a),this.addJournal("Écoles","création",`École ${a.denomination} créée`),this.pushToast("École créée.")}}deleteEcole(e){const n=this.fichesControle.some(r=>r.ecoleId===e),a=this.rapports.some(r=>r.ecoleId===e);if(n||a)return this.pushToast("Suppression impossible : des fiches ou rapports sont liés. Proposez une désactivation.","danger"),!1;const c=this.ecoles.find(r=>r.id===e);return this.ecoles=this.ecoles.filter(r=>r.id!==e),this.addJournal("Écoles","suppression",`École ${c==null?void 0:c.denomination} supprimée`),this.pushToast("École supprimée."),!0}deactivateEcole(e){this.ecoles=this.ecoles.map(n=>n.id===e?{...n,statut:"fermeture_temporaire",updatedAt:B()}:n),this.addJournal("Écoles","modification",`École ${e} désactivée`),this.pushToast("École désactivée (fermeture temporaire).")}upsertChef(e){if(this.chefs.some(a=>a.id===e.id))this.chefs=this.chefs.map(a=>a.id===e.id?{...a,...e}:a),this.pushToast("Chef d'établissement mis à jour."),this.addJournal("Chefs","modification",`Chef ${e.nomComplet} modifié`);else{const a={...e,id:J("chef"),createdAt:B()};this.chefs.unshift(a),this.pushToast("Chef d'établissement créé."),this.addJournal("Chefs","création",`Chef ${a.nomComplet} créé`)}}deleteChef(e){this.chefs=this.chefs.filter(n=>n.id!==e),this.pushToast("Chef d'établissement supprimé."),this.addJournal("Chefs","suppression",`Chef ${e} supprimé`)}upsertUtilisateur(e){if(this.utilisateurs.some(a=>a.id===e.id))this.utilisateurs=this.utilisateurs.map(a=>a.id===e.id?{...a,...e}:a),this.pushToast("Utilisateur mis à jour."),this.addJournal("Utilisateurs","modification",`Utilisateur ${e.nom} modifié`);else{const a={...e,id:J("usr"),motDePasse:e.motDePasse||"changeme123",createdAt:B()};this.utilisateurs.unshift(a),this.pushToast("Utilisateur créé."),this.addJournal("Utilisateurs","création",`Utilisateur ${a.nom} créé`)}}deleteUtilisateur(e){this.utilisateurs=this.utilisateurs.filter(n=>n.id!==e),this.pushToast("Utilisateur supprimé."),this.addJournal("Utilisateurs","suppression",`Utilisateur ${e} supprimé`)}resetPassword(e){this.utilisateurs=this.utilisateurs.map(n=>n.id===e?{...n,motDePasse:"Reset@123"}:n),this.pushToast("Mot de passe réinitialisé (simulé) : Reset@123"),this.addJournal("Utilisateurs","réinitialisation",`Mot de passe réinitialisé pour ${e}`)}upsertOrdre(e){if(this.ordresMission.some(a=>a.id===e.id))this.ordresMission=this.ordresMission.map(a=>a.id===e.id?{...a,...e}:a),this.pushToast("Ordre de mission mis à jour."),this.addJournal("Ordres de mission","modification",`Ordre ${e.numero} modifié`);else{const a=this.ordresMission.length+1,c={...e,id:J("om"),numero:e.numero||`OM/PEK-MA/2024/${String(a).padStart(4,"0")}`,statut:e.statut||"en_attente_signature",signePar:null,signeLe:null,createdAt:B()};this.ordresMission.unshift(c),this.pushToast("Ordre de mission créé."),this.addJournal("Ordres de mission","création",`Ordre ${c.numero} créé`)}}deleteOrdre(e){this.ordresMission=this.ordresMission.filter(n=>n.id!==e),this.pushToast("Ordre de mission supprimé."),this.addJournal("Ordres de mission","suppression",`Ordre ${e} supprimé`)}signerOrdre(e){const n=this.currentUser;this.ordresMission=this.ordresMission.map(a=>a.id===e?{...a,statut:"signe",signePar:n==null?void 0:n.id,signeLe:B()}:a),this.addNotification({type:"signature",titre:"Ordre de mission signé",message:`L'ordre ${e} a été signé.`}),this.pushToast("Ordre signé."),this.addJournal("Ordres de mission","signature",`Ordre ${e} signé`)}upsertFiche(e){if(this.fichesControle.some(a=>a.id===e.id))this.fichesControle=this.fichesControle.map(a=>a.id===e.id?{...a,...e,updatedAt:B()}:a),this.pushToast("Fiche de contrôle mise à jour."),this.addJournal("Fiches","modification",`Fiche ${e.numero||e.id} modifiée`);else{const a=this.fichesControle.length+1,c={...e,id:J("fc"),numero:`FC/2024/${String(a).padStart(4,"0")}`,statut:e.statut||"brouillon",photos:e.photos||[],valideePar:null,valideeLe:null,createdAt:B(),updatedAt:B()};this.fichesControle.unshift(c),this.pushToast("Fiche de contrôle créée."),this.addJournal("Fiches","création",`Fiche ${c.numero} créée`)}}deleteFiche(e){this.fichesControle=this.fichesControle.filter(n=>n.id!==e),this.pushToast("Fiche supprimée."),this.addJournal("Fiches","suppression",`Fiche ${e} supprimée`)}validerFiche(e){const n=this.currentUser;this.fichesControle=this.fichesControle.map(a=>a.id===e?{...a,statut:"validee",valideePar:n==null?void 0:n.id,valideeLe:B(),updatedAt:B()}:a),this.addNotification({type:"validation",titre:"Fiche validée",message:`La fiche ${e} a été validée (Lu et approuvé).`}),this.pushToast("Fiche validée électroniquement."),this.addJournal("Fiches","validation",`Fiche ${e} validée`)}upsertRapport(e){if(this.rapports.some(a=>a.id===e.id))this.rapports=this.rapports.map(a=>a.id===e.id?{...a,...e}:a),this.pushToast("Rapport mis à jour."),this.addJournal("Rapports","modification",`Rapport ${e.numero||e.id} modifié`);else{const a=this.rapports.length+1,c={...e,id:J("rap"),numero:`RAP/PEK-MA/2024/${String(a).padStart(4,"0")}`,statut:e.statut||"brouillon",deposeLe:null,deposePar:null,accuseReceptionLe:null,accusePar:null,transmisLe:null,createdAt:B()};this.rapports.unshift(c),this.pushToast("Rapport créé."),this.addJournal("Rapports","création",`Rapport ${c.numero} créé`)}}deleteRapport(e){this.rapports=this.rapports.filter(n=>n.id!==e),this.pushToast("Rapport supprimé."),this.addJournal("Rapports","suppression",`Rapport ${e} supprimé`)}deposerRapport(e){const n=this.currentUser;this.rapports=this.rapports.map(a=>a.id===e?{...a,statut:"depose",deposeLe:B(),deposePar:n==null?void 0:n.id}:a),this.addNotification({type:"depot",titre:"Rapport déposé",message:`Le rapport ${e} a été déposé au secrétariat.`}),this.pushToast("Rapport déposé au secrétariat."),this.addJournal("Rapports","dépôt",`Rapport ${e} déposé`)}delivrerAccuse(e){const n=this.currentUser;this.rapports=this.rapports.map(a=>a.id===e?{...a,statut:"recu",accuseReceptionLe:B(),accusePar:n==null?void 0:n.id}:a),this.pushToast("Accusé de réception délivré."),this.addJournal("Rapports","accusé",`Accusé délivré pour ${e}`)}transmettreRapport(e){this.rapports=this.rapports.map(n=>n.id===e?{...n,statut:"transmis",transmisLe:B()}:n),this.addNotification({type:"transmission",titre:"Rapport transmis",message:`Le rapport ${e} a été transmis au Directeur Provincial.`}),this.pushToast("Rapport transmis au Directeur Provincial."),this.addJournal("Rapports","transmission",`Rapport ${e} transmis`)}upsertDecision(e){var c;const n=this.decisions.some(r=>r.id===e.id),a={maintien:"active",rehabilitation:"rehabilitation",fermeture_temporaire:"fermeture_temporaire",fermeture_definitive:"fermeture_definitive"};if(n)this.decisions=this.decisions.map(r=>r.id===e.id?{...r,...e}:r),this.ecoles=this.ecoles.map(r=>r.id===e.ecoleId?{...r,statut:a[e.type]||r.statut,updatedAt:B()}:r),this.rapports=this.rapports.map(r=>r.id===e.rapportId?{...r,statut:"traite"}:r),this.pushToast("Décision mise à jour. Statut école synchronisé."),this.addJournal("Décisions","modification",`Décision ${e.numero||e.id} modifiée`);else{const r=this.decisions.length+1,o={...e,id:J("dec"),numero:`DEC/2024/${String(r).padStart(4,"0")}`,decidePar:(c=this.currentUser)==null?void 0:c.id,decideLe:B(),statutExecution:e.statutExecution||"en_cours",createdAt:B()};this.decisions.unshift(o),this.ecoles=this.ecoles.map(s=>s.id===o.ecoleId?{...s,statut:a[o.type]||s.statut,updatedAt:B()}:s),this.rapports=this.rapports.map(s=>s.id===o.rapportId?{...s,statut:"traite"}:s),this.addNotification({type:"decision",titre:"Nouvelle décision",message:`Décision ${o.numero} enregistrée.`}),this.pushToast("Décision enregistrée. Statut de l'école mis à jour."),this.addJournal("Décisions","création",`Décision ${o.numero} créée`)}}deleteDecision(e){this.decisions=this.decisions.filter(n=>n.id!==e),this.pushToast("Décision supprimée."),this.addJournal("Décisions","suppression",`Décision ${e} supprimée`)}upsertRef(e,n){const a=this[e],c=a.some(r=>r.id===n.id);c?(this[e]=a.map(r=>r.id===n.id?{...r,...n}:r),this.pushToast("Référence mise à jour.")):(this[e]=[{...n,id:J(e.slice(0,3)),actif:!0},...a],this.pushToast("Référence ajoutée.")),this.addJournal("Paramètres",c?"modification":"création",`${e} mis à jour`),this.notify()}deleteRef(e,n){this[e]=this[e].filter(a=>a.id!==n),this.pushToast("Référence supprimée."),this.addJournal("Paramètres","suppression",`${e} ${n} supprimé`),this.notify()}}const m=new mt,pt=[{key:"dashboard",to:"#/",label:"Tableau de bord",icon:"ti-layout-dashboard"},{key:"ecoles",to:"#/ecoles",label:"Écoles",icon:"ti-building-community"},{key:"chefs",to:"#/chefs",label:"Chefs d'établissement",icon:"ti-user-star"},{key:"utilisateurs",to:"#/utilisateurs",label:"Utilisateurs",icon:"ti-users"},{key:"ordres",to:"#/ordres-mission",label:"Ordres de mission",icon:"ti-file-certificate"},{key:"fiches",to:"#/fiches-controle",label:"Fiches de contrôle",icon:"ti-clipboard-check"},{key:"rapports",to:"#/rapports",label:"Rapports d'inspection",icon:"ti-report-analytics"},{key:"accuses",to:"#/accuses",label:"Accusés de réception",icon:"ti-mail-check"},{key:"decisions",to:"#/decisions",label:"Décisions",icon:"ti-gavel"},{key:"statistiques",to:"#/statistiques",label:"Statistiques",icon:"ti-chart-histogram"},{key:"parametres",to:"#/parametres",label:"Paramètres",icon:"ti-settings"},{key:"journal",to:"#/journal",label:"Journal d'activité",icon:"ti-history"}];function ft(t="#/"){const e=m.currentUser,n=e==null?void 0:e.role,a=pt.filter(c=>Te(n,c.key)).map(c=>{const r=t===c.to||c.to==="#/"&&(t===""||t==="#/");return`
        <li class="nav-item">
          <a href="${c.to}" class="nav-link ${r?"active":""}">
            <span class="nav-icon">
              <i class="ti ${c.icon}" style="font-size: 20px;"></i>
            </span>
            <span class="text">${c.label}</span>
          </a>
        </li>
      `}).join("");return`
    <div id="miniSidebar">
      <div class="brand-logo">
        <a class="d-none d-md-flex align-items-center gap-2" href="#/">
          <img src="/assets/images/brand/logo/logo-icon.svg" alt="" />
          <span class="fw-bold fs-4 site-logo-text">Inspect-San</span>
        </a>
      </div>
      <ul class="navbar-nav flex-column">
        <li class="nav-item">
          <div class="nav-heading">Inspect-San</div>
          <hr class="mx-5 nav-line mb-1" />
        </li>
        ${a}
        <li>
          <div class="text-center py-5 upgrade-ui">
            <div>
              <img src="/assets/images/avatar/avatar-1.jpg" alt="" class="avatar avatar-md rounded-circle" />
              <div class="my-3">
                <h5 class="mb-1 fs-6">${(e==null?void 0:e.nom)||""}</h5>
                <span class="text-secondary">${(e==null?void 0:e.role)||""}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div
      class="offcanvasNav offcanvas offcanvas-start"
      tabIndex="-1"
      id="offcanvasExample"
      aria-labelledby="offcanvasExampleLabel"
    >
      <div class="offcanvas-header">
        <a class="d-flex align-items-center gap-2" href="#/">
          <img src="/assets/images/brand/logo/logo-icon.svg" alt="" />
          <span class="fw-bold fs-4 site-logo-text">Inspect-San</span>
        </a>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-0">
        <ul class="navbar-nav flex-column">
          <li class="nav-item">
            <div class="nav-heading">Inspect-San</div>
            <hr class="mx-5 nav-line mb-1" />
          </li>
          ${a}
          <li>
            <div class="text-center py-5 upgrade-ui">
              <div>
                <img src="/assets/images/avatar/avatar-1.jpg" alt="" class="avatar avatar-md rounded-circle" />
                <div class="my-3">
                  <h5 class="mb-1 fs-6">${(e==null?void 0:e.nom)||""}</h5>
                  <span class="text-secondary">${(e==null?void 0:e.role)||""}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `}function vt(t){if(!t)return;const e=document.getElementById("offcanvasExample");e&&e.querySelectorAll(".nav-link").forEach(a=>{a.addEventListener("click",()=>{if(window.bootstrap){const c=window.bootstrap.Offcanvas.getInstance(e);c&&c.hide()}})})}const ye="theme";function ht(){return localStorage.getItem(ye)}function bt(){const t=ht();return t||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}function Ze(t){t==="auto"&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.setAttribute("data-bs-theme","dark"):t==="auto"?document.documentElement.setAttribute("data-bs-theme","light"):document.documentElement.setAttribute("data-bs-theme",t)}const fe=[{value:"light",label:"Clair",icon:"ti-sun"},{value:"dark",label:"Sombre",icon:"ti-moon-stars"},{value:"auto",label:"Système",icon:"ti-circle-half-2"}];function Ee(){var n;const t=bt();return Ze(t),`
    <li>
      <div className="dropdown">
        <button
          className="btn btn-ghost btn-icon rounded-circle d-flex align-items-center"
          type="button"
          aria-expanded="false"
          data-bs-toggle="dropdown"
          aria-label="Changer le thème"
        >
          <i className="ti theme-icon-active lh-1 fs-5 ${((n=fe.find(a=>a.value===t))==null?void 0:n.icon)||"ti-sun"}"></i>
          <span className="visually-hidden bs-theme-text">Changer le thème</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow">
          ${fe.map(a=>`
            <li>
              <button
                type="button"
                className="dropdown-item d-flex align-items-center ${t===a.value?"active":""}"
                data-theme-value="${a.value}"
                aria-pressed="${t===a.value}"
              >
                <i className="ti theme-icon ${a.icon}"></i>
                <span className="ms-2">${a.label}</span>
              </button>
            </li>
          `).join("")}
        </ul>
      </div>
    </li>
  `}function Pe(t){if(!t)return;const e=t.querySelectorAll("[data-theme-value]");e.forEach(n=>{n.addEventListener("click",a=>{a.preventDefault();const c=n.getAttribute("data-theme-value");localStorage.setItem(ye,c),Ze(c),e.forEach(o=>{const s=o.getAttribute("data-theme-value")===c;o.classList.toggle("active",s),o.setAttribute("aria-pressed",s?"true":"false")});const r=t.querySelector(".theme-icon-active");if(r){const o=fe.find(s=>s.value===c);r.className=`ti theme-icon-active lh-1 fs-5 ${(o==null?void 0:o.icon)||"ti-sun"}`}})})}function gt(){var s;const t=m.currentUser,e=m.utilisateurs,n=m.notifications,a=n.slice(0,12),c=n.filter(i=>!i.lu).length,r=e.filter(i=>i.statut==="actif").map(i=>`
      <option value="${i.id}" ${i.id===(t==null?void 0:t.id)?"selected":""}>
        ${i.role} — ${i.nom}
      </option>
    `).join(""),o=a.length===0?'<div class="p-3 text-secondary">Aucune notification</div>':a.map(i=>`
        <button
          type="button"
          class="dropdown-item text-wrap py-3 ${i.lu?"":"bg-light"}"
          data-notif-id="${i.id}"
        >
          <div class="fw-semibold">${i.titre}</div>
          <div class="small text-secondary">${i.message}</div>
          <div class="small text-muted mt-1">${z(i.createdAt)}</div>
        </button>
      `).join("");return`
    <div class="navbar-glass navbar navbar-expand-lg px-0 px-lg-4">
      <div class="container-fluid px-lg-0">
        <div class="d-flex align-items-center gap-4">
          <div class="d-block d-lg-none">
            <a
              class="text-inherit"
              data-bs-toggle="offcanvas"
              href="#offcanvasExample"
              role="button"
              aria-controls="offcanvasExample"
            >
              <i class="ti ti-menu-2 fs-4"></i>
            </a>
          </div>
          <div class="d-none d-lg-block">
            <a class="sidebar-toggle d-flex texttooltip p-3" id="sidebarToggleBtn" href="#!">
              <span class="collapse-mini">
                <i class="ti ti-arrow-bar-left text-secondary"></i>
              </span>
              <span class="collapse-expanded">
                <i class="ti ti-arrow-bar-right text-secondary"></i>
              </span>
            </a>
          </div>
          <div class="d-none d-md-block">
            <span class="text-secondary small">Province Éducationnelle</span>
            <div class="fw-semibold">Kinshasa / Mont-Amba</div>
          </div>
        </div>

        <ul class="list-unstyled d-flex align-items-center mb-0 gap-2 gap-lg-3">
          <li class="d-none d-xl-block">
            <div class="d-flex align-items-center gap-2">
              <label class="form-label mb-0 small text-secondary" for="roleSwitchSelect">
                Simuler rôle
              </label>
              <select
                id="roleSwitchSelect"
                class="form-select form-select-sm"
                style="min-width: 220px;"
              >
                ${r}
              </select>
            </div>
          </li>

          ${Ee()}

          <li class="dropdown position-relative">
            <button
              type="button"
              class="btn btn-ghost btn-icon position-relative"
              id="notifDropdownToggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Notifications"
            >
              <i class="ti ti-bell fs-4"></i>
              ${c>0?`<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      ${c>9?"9+":c}
                    </span>`:""}
            </button>
            <div
              class="dropdown-menu dropdown-menu-end p-0 shadow"
              style="width: 360px; max-height: 420px; overflow: auto; right: 0; left: auto;"
            >
              <div class="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                <strong>Notifications</strong>
                <button type="button" class="btn btn-link btn-sm" id="markAllReadBtn">
                  Tout marquer lu
                </button>
              </div>
              <div id="notifListContainer">
                ${o}
              </div>
            </div>
          </li>

          <li class="dropdown">
            <a
              class="dropdown-toggle d-flex align-items-center gap-2 text-decoration-none"
              href="#!"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="/assets/images/avatar/avatar-1.jpg"
                alt=""
                class="avatar avatar-sm rounded-circle"
              />
              <span class="d-none d-md-inline text-body">${((s=t==null?void 0:t.nom)==null?void 0:s.split(" ").slice(0,2).join(" "))||""}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <span class="dropdown-item-text small text-secondary">${(t==null?void 0:t.role)||""}</span>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" href="#/parametres">Paramètres</a>
              </li>
              <li>
                <button type="button" class="dropdown-item text-danger" id="logoutBtn">
                  Déconnexion
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  `}function It(t){if(!t)return;Pe(t);const e=t.querySelector("#sidebarToggleBtn");e&&e.addEventListener("click",o=>{o.preventDefault(),document.documentElement.classList.contains("expanded")?(document.documentElement.classList.remove("expanded"),document.documentElement.classList.add("collapsed"),localStorage.setItem("sidebarExpanded","false")):(document.documentElement.classList.remove("collapsed"),document.documentElement.classList.add("expanded"),localStorage.setItem("sidebarExpanded","true"))});const n=t.querySelector("#roleSwitchSelect");n&&n.addEventListener("change",o=>{m.switchRoleUser(o.target.value)});const a=t.querySelector("#markAllReadBtn");a&&a.addEventListener("click",()=>{m.markAllNotificationsRead()}),t.querySelectorAll("[data-notif-id]").forEach(o=>{o.addEventListener("click",()=>{const s=o.getAttribute("data-notif-id");m.markNotificationRead(s)})});const r=t.querySelector("#logoutBtn");r&&r.addEventListener("click",()=>{m.logout(),window.location.hash="#/connexion"})}function ge(){return`
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090">
      ${m.toasts.map(e=>`
        <div class="toast show align-items-center text-bg-${e.type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">${e.message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-toast-id="${e.id}" aria-label="Fermer"></button>
          </div>
        </div>
      `).join("")}
    </div>
  `}function Ie(t){if(!t)return;t.querySelectorAll("[data-toast-id]").forEach(n=>{n.addEventListener("click",()=>{const a=n.getAttribute("data-toast-id");m.removeToast(a)})})}function Y({id:t,title:e,contentHtml:n,footerHtml:a="",size:c="lg"}){return`
    <div class="modal fade" id="${t}" tabIndex="-1" aria-hidden="true">
      <div class="modal-dialog modal-${c} modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${e}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div class="modal-body">${n}</div>
          ${a?`<div class="modal-footer">${a}</div>`:""}
        </div>
      </div>
    </div>
  `}function j(t){const e=document.getElementById(t);e&&window.bootstrap&&window.bootstrap.Modal.getOrCreateInstance(e,{backdrop:"static",keyboard:!0}).show()}function X(t){const e=document.getElementById(t);if(e&&window.bootstrap){const n=window.bootstrap.Modal.getInstance(e);n&&n.hide()}}function At(){const t=Y({id:"forgotModal",title:"Mot de passe oublié",size:"md",contentHtml:`
      <p>
        En environnement de démonstration, contactez l'administrateur système pour
        réinitialiser votre mot de passe. Aucun e-mail n'est envoyé (front-end uniquement).
      </p>
    `,footerHtml:`
      <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
        Compris
      </button>
    `});return`
    <main class="d-flex flex-column justify-content-center vh-100 position-relative">
      <div class="position-absolute top-0 end-0 p-3">
        <ul class="list-unstyled mb-0">
          ${Ee()}
        </ul>
      </div>
      <section>
        <div class="container">
          <div class="row mb-8">
            <div class="col-xl-4 offset-xl-4 col-md-12 col-12">
              <div class="text-center">
                <a href="#/" class="fs-2 fw-bold d-flex align-items-center gap-2 justify-content-center mb-6 text-decoration-none text-body">
                  <img src="/assets/images/brand/logo/logo-icon.svg" alt="" />
                  <span>Inspect-San</span>
                </a>
                <h1 class="mb-1">Connexion</h1>
                <p class="mb-0 text-secondary">
                  Contrôle sanitaire — Province Éducationnelle de Kinshasa/Mont-Amba
                </p>
              </div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 col-12">
              <div class="card card-lg mb-6">
                <div class="card-body p-6">
                  <form id="loginForm" class="mb-4">
                    <div class="mb-3">
                      <label for="identifiant" class="form-label">
                        Identifiant <span class="text-danger">*</span>
                      </label>
                      <input
                        id="identifiant"
                        class="form-control"
                        value="admin"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="password" class="form-label">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        id="password"
                        class="form-control"
                        value="admin123"
                        required
                      />
                    </div>
                    <div id="loginErrorAlert" class="alert alert-danger py-2 d-none"></div>
                    <div class="mb-4 d-flex align-items-center justify-content-between">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember" />
                        <label class="form-check-label" for="remember">
                          Se souvenir de moi
                        </label>
                      </div>
                      <button
                        type="button"
                        class="btn btn-link p-0 text-primary"
                        id="forgotPasswordBtn"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div class="d-grid">
                      <button class="btn btn-primary" type="submit">
                        Se connecter
                      </button>
                    </div>
                  </form>
                  <div class="border-top pt-4">
                    <p class="small text-secondary mb-2">Comptes de démonstration :</p>
                    <ul class="small text-secondary mb-0">
                      <li>admin / admin123 (Administrateur)</li>
                      <li>directeur / dir123 (Directeur Provincial)</li>
                      <li>controleur / ctrl123 (Contrôleur)</li>
                      <li>secretariat / sec123 (Secrétariat)</li>
                      <li>chef / chef123 (Chef d'établissement)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${t}
    </main>
  `}function Tt(t){if(!t)return;Pe(t);const e=t.querySelector("#loginForm"),n=t.querySelector("#loginErrorAlert");e&&e.addEventListener("submit",c=>{c.preventDefault();const r=t.querySelector("#identifiant").value.trim(),o=t.querySelector("#password").value,s=m.login(r,o);if(!s.ok){n.textContent=s.error,n.classList.remove("d-none"),m.pushToast(s.error,"danger");return}n.classList.add("d-none"),m.pushToast(`Bienvenue, ${s.user.nom}`),window.location.hash="#/"});const a=t.querySelector("#forgotPasswordBtn");a&&a.addEventListener("click",()=>{j("forgotModal")})}function H({title:t,subtitle:e,actionsHtml:n=""}){return`
    <div class="row mb-6 align-items-center">
      <div class="col-lg-8 col-md-7">
        <h1 class="mb-1 h2">${t}</h1>
        ${e?`<p class="mb-0 text-secondary">${e}</p>`:""}
      </div>
      ${n?`<div class="col-lg-4 col-md-5 text-md-end mt-3 mt-md-0">${n}</div>`:""}
    </div>
  `}const yt=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],Zt={"Administrateur système":"Vous disposez d'une vue complète sur toutes les écoles, missions, rapports et décisions de la province.","Directeur Provincial":"Consultez les rapports transmis par le secrétariat et statuez sur les décisions en attente.",Contrôleur:"Ce tableau de bord affiche uniquement vos ordres de mission et les fiches de contrôle qui en découlent.","Agent du Secrétariat":"Suivez les rapports déposés à accuser réception, puis à transmettre au Directeur Provincial.","Chef d'établissement":"Vous visualisez ici les fiches de contrôle et décisions concernant votre établissement uniquement."};function se({icon:t,color:e,label:n,value:a,hint:c}){return`
    <div class="col-xl-3 col-sm-6">
      <div class="card card-lg h-100">
        <div class="card-body d-flex align-items-center gap-3">
          <div class="icon-shape icon-lg rounded-circle bg-${e}-subtle text-${e}-emphasis flex-shrink-0">
            <i class="ti ${t} fs-3"></i>
          </div>
          <div>
            <h3 class="mb-0">${a}</h3>
            <p class="mb-0 text-secondary small">${n}</p>
            ${c?`<p class="mb-0 text-muted" style="font-size: 0.75rem;">${c}</p>`:""}
          </div>
        </div>
      </div>
    </div>
  `}let te=[];function Et(){const t=m.currentUser,e=m.ecoles,n=m.ordresMission,a=m.fichesControle,c=m.rapports,r=m.decisions,o=m.journalActivite,s=m.utilisateurs,i=t==null?void 0:t.role,l=i==="Chef d'établissement",p=i==="Contrôleur";let I=n;l?I=n.filter(C=>C.ecoleId===(t==null?void 0:t.ecoleId)):p&&(I=n.filter(C=>{var P;return(P=C.controleurIds)==null?void 0:P.includes(t==null?void 0:t.id)}));let g=a;if(l)g=a.filter(C=>C.ecoleId===(t==null?void 0:t.ecoleId));else if(p){const C=new Set(I.map(P=>P.id));g=a.filter(P=>C.has(P.ordreMissionId))}const b=l?c.filter(C=>C.ecoleId===(t==null?void 0:t.ecoleId)):c,v=l?r.filter(C=>C.ecoleId===(t==null?void 0:t.ecoleId)):r,d=l?t!=null&&t.ecoleId?1:0:e.length,u=I.filter(C=>C.statut==="en_cours").length,h=g.filter(C=>C.statut==="en_attente_validation").length,Z=b.filter(C=>C.statut==="depose").length,E=b.filter(C=>C.statut==="transmis"&&!r.some(P=>P.rapportId===C.id)).length,N=v.filter(C=>C.statutExecution==="en_cours").length,A=E+N,f=[...o].sort((C,P)=>new Date(P.createdAt)-new Date(C.createdAt)).slice(0,8).map(C=>{var P;return{...C,userName:((P=s.find(R=>R.id===C.utilisateurId))==null?void 0:P.nom)||"Système"}}),M=Zt[i];return`
    <div>
      ${H({title:"Tableau de bord",subtitle:`Bienvenue, ${(t==null?void 0:t.nom)||""} — ${i||""}`})}

      <div class="row g-3 mb-6">
        ${se({icon:"ti-building-community",color:"primary",label:l?"Mon établissement":"Écoles enregistrées",value:d})}
        ${se({icon:"ti-file-certificate",color:"info",label:"Missions en cours",value:u})}
        ${se({icon:"ti-clipboard-check",color:"warning",label:"Fiches en attente de validation",value:h})}
        ${se({icon:"ti-report-analytics",color:"success",label:"Rapports déposés",value:Z})}
      </div>

      <div class="row g-3 mb-6">
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="icon-shape icon-lg rounded-circle bg-danger-subtle text-danger-emphasis flex-shrink-0">
                <i class="ti ti-gavel fs-3"></i>
              </div>
              <div>
                <h3 class="mb-0">${A}</h3>
                <p class="mb-0 text-secondary small">Décisions en attente</p>
                <p class="mb-0 text-muted" style="font-size: 0.75rem;">
                  Rapports transmis sans décision + décisions en cours d'exécution
                </p>
              </div>
            </div>
          </div>
        </div>

        ${M?`
          <div class="col-xl-9 col-sm-6">
            <div class="card card-lg h-100">
              <div class="card-body d-flex align-items-center gap-3">
                <i class="ti ti-bulb fs-3 text-primary flex-shrink-0"></i>
                <p class="mb-0">${M}</p>
              </div>
            </div>
          </div>
        `:""}
      </div>

      <div class="row g-3 mb-6">
        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Conformité par commune</h5>
              <div id="chartConformite"></div>
            </div>
          </div>
        </div>

        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Contrôles réalisés (par mois)</h5>
              <div id="chartControles"></div>
            </div>
          </div>
        </div>

        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Répartition des décisions</h5>
              <div id="chartDecisions"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12">
          <div class="card card-lg">
            <div class="card-header border-bottom-0">
              <h5 class="mb-0">Activités récentes</h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Utilisateur</th>
                      <th>Module</th>
                      <th>Action</th>
                      <th>Détail</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${f.length===0?`
                      <tr>
                        <td colSpan="5" class="text-center text-secondary py-5">
                          Aucune activité récente.
                        </td>
                      </tr>
                    `:f.map(C=>`
                        <tr>
                          <td>${z(C.createdAt)}</td>
                          <td>${C.userName}</td>
                          <td>${C.module}</td>
                          <td class="text-capitalize">${C.action}</td>
                          <td>${C.detail}</td>
                        </tr>
                      `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function Pt(t){if(!t||(te.forEach(A=>{try{A.destroy()}catch{}}),te=[],typeof window.ApexCharts>"u"))return;const e=m.currentUser,n=m.ecoles,a=m.ordresMission,c=m.fichesControle,r=m.decisions,o=e==null?void 0:e.role,s=o==="Chef d'établissement",i=o==="Contrôleur";let l=a;s?l=a.filter(A=>A.ecoleId===(e==null?void 0:e.ecoleId)):i&&(l=a.filter(A=>{var f;return(f=A.controleurIds)==null?void 0:f.includes(e==null?void 0:e.id)}));let p=c;if(s)p=c.filter(A=>A.ecoleId===(e==null?void 0:e.ecoleId));else if(i){const A=new Set(l.map(f=>f.id));p=c.filter(f=>A.has(f.ordreMissionId))}const I=s?r.filter(A=>A.ecoleId===(e==null?void 0:e.ecoleId)):r,g={};p.forEach(A=>{var G,C;const f=n.find(P=>P.id===A.ecoleId),M=((G=f==null?void 0:f.adresse)==null?void 0:G.commune)||"Non renseignée";g[M]||(g[M]={total:0,conforme:0}),g[M].total+=1,["Bon","Moyen"].includes((C=A.sectionBatiments)==null?void 0:C.etatGeneral)&&(g[M].conforme+=1)});const b=Object.entries(g).map(([A,f])=>({commune:A,taux:f.total?Math.round(f.conforme/f.total*100):0})).sort((A,f)=>f.taux-A.taux).slice(0,10),v=t.querySelector("#chartConformite");if(v)if(b.length===0)v.innerHTML='<p class="text-secondary mb-0">Aucune donnée disponible.</p>';else{const A=new window.ApexCharts(v,{chart:{type:"bar",height:300,toolbar:{show:!1}},plotOptions:{bar:{borderRadius:4,horizontal:!0}},dataLabels:{enabled:!0,formatter:f=>`${f}%`},xaxis:{categories:b.map(f=>f.commune),max:100},colors:["#0d6efd"],series:[{name:"Taux de conformité (%)",data:b.map(f=>f.taux)}]});A.render(),te.push(A)}const d={};p.forEach(A=>{const f=new Date(A.createdAt),M=`${f.getFullYear()}-${String(f.getMonth()+1).padStart(2,"0")}`;d[M]=(d[M]||0)+1});const u=Object.entries(d).sort(([A],[f])=>A.localeCompare(f)).slice(-12).map(([A,f])=>{const[M,G]=A.split("-");return{label:`${yt[Number(G)-1]} ${M.slice(2)}`,count:f}}),h=t.querySelector("#chartControles");if(h)if(u.length===0)h.innerHTML='<p class="text-secondary mb-0">Aucune donnée disponible.</p>';else{const A=new window.ApexCharts(h,{chart:{type:"line",height:300,toolbar:{show:!1}},stroke:{curve:"smooth",width:3},xaxis:{categories:u.map(f=>f.label)},colors:["#20c997"],series:[{name:"Fiches de contrôle",data:u.map(f=>f.count)}]});A.render(),te.push(A)}const Z={};I.forEach(A=>{Z[A.type]=(Z[A.type]||0)+1});const E=Object.entries(Z).map(([A,f])=>({label:ne[A]||A,count:f})),N=t.querySelector("#chartDecisions");if(N)if(E.length===0)N.innerHTML='<p class="text-secondary mb-0">Aucune décision enregistrée.</p>';else{const A=new window.ApexCharts(N,{chart:{type:"donut",height:300},labels:E.map(f=>f.label),colors:["#0d6efd","#ffc107","#fd7e14","#dc3545"],legend:{position:"bottom"},series:E.map(f=>f.count)});A.render(),te.push(A)}}function Ct({page:t,totalPages:e,total:n,pageSize:a}){if(n===0)return'<p class="text-secondary mb-0 mt-3">Aucun résultat.</p>';const c=(t-1)*a+1,r=Math.min(t*a,n),o=Array.from({length:e},(s,i)=>i+1).filter(s=>s===1||s===e||Math.abs(s-t)<=1).reduce((s,i,l,p)=>(l>0&&i-p[l-1]>1&&s.push("…"),s.push(i),s),[]);return`
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-4">
      <span class="text-secondary small">
        Affichage ${c}–${r} sur ${n}
      </span>
      <nav>
        <ul class="pagination mb-0">
          <li class="page-item ${t<=1?"disabled":""}">
            <button type="button" class="page-link" data-page="${t-1}">
              Précédent
            </button>
          </li>
          ${o.map(s=>s==="…"?'<li class="page-item disabled"><span class="page-link">…</span></li>':`<li class="page-item ${s===t?"active":""}">
                     <button type="button" class="page-link" data-page="${s}">${s}</button>
                   </li>`).join("")}
          <li class="page-item ${t>=e?"disabled":""}">
            <button type="button" class="page-link" data-page="${t+1}">
              Suivant
            </button>
          </li>
        </ul>
      </nav>
    </div>
  `}function Q({columns:t,rows:e,searchKeys:n=[],searchPlaceholder:a="Rechercher…",filtersHtml:c="",emptyMessage:r="Aucun enregistrement trouvé.",toolbarHtml:o="",q:s="",page:i=1,sortKey:l=null,sortDir:p="asc"}){let I=e;if(s.trim()&&n.length){const E=s.trim().toLowerCase();I=I.filter(N=>n.some(A=>String(typeof A=="function"?A(N):N[A]??"").toLowerCase().includes(E)))}l&&(I=ct(I,l,p));const{items:g,total:b,totalPages:v,page:d}=lt(I,i,be),u=t.map(E=>{const A=l===(E.sortKey||E.key)?`<i class="ti ti-arrow-${p==="asc"?"up":"down"} ms-1"></i>`:"";return E.sortable?`
          <th>
            <button
              type="button"
              class="btn btn-link btn-sm p-0 text-decoration-none text-body"
              data-sort-key="${E.sortKey||E.key}"
            >
              ${E.header}
              ${A}
            </button>
          </th>
        `:`<th>${E.header}</th>`}).join(""),h=g.length===0?`
        <tr>
          <td colSpan="${t.length}" class="text-center text-secondary py-5">
            ${r}
          </td>
        </tr>
      `:g.map(E=>`
        <tr data-id="${E.id}">
          ${t.map(N=>`<td>${N.render?N.render(E):E[N.key]??"—"}</td>`).join("")}
        </tr>
      `).join(""),Z=Ct({page:d,totalPages:v,total:b,pageSize:be});return`
    <div class="card">
      <div class="card-header border-bottom-0">
        <div class="row g-3 align-items-center">
          <div class="col-md-4">
            <input
              type="search"
              class="form-control datatable-search"
              placeholder="${a}"
              value="${s}"
            />
          </div>
          ${c?`<div class="col-md-8">${c}</div>`:""}
        </div>
        ${o?`<div class="mt-3">${o}</div>`:""}
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0 text-nowrap">
            <thead class="table-light">
              <tr>
                ${u}
              </tr>
            </thead>
            <tbody>
              ${h}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer">
        ${Z}
      </div>
    </div>
  `}function W(t,{onSearch:e,onPageChange:n,onSortChange:a,onActionClick:c}){if(!t)return;const r=t.querySelector(".datatable-search");r&&r.addEventListener("input",i=>{e(i.target.value)}),t.querySelectorAll("[data-sort-key]").forEach(i=>{i.addEventListener("click",()=>{a(i.getAttribute("data-sort-key"))})}),t.querySelectorAll(".page-link[data-page]").forEach(i=>{i.addEventListener("click",()=>{const l=parseInt(i.getAttribute("data-page"),10);isNaN(l)||n(l)})}),c&&t.querySelectorAll("[data-action]").forEach(i=>{i.addEventListener("click",l=>{const p=i.getAttribute("data-action"),I=i.getAttribute("data-id");c(p,I,i,l)})})}function V(t,e){const n=(t==null?void 0:t[e])||e||"—",c={active:"success",actif:"success",validee:"success",signe:"success",executee:"success",traite:"success",rehabilitation:"warning",en_cours:"primary",en_attente_signature:"warning",en_attente_validation:"warning",brouillon:"secondary",depose:"info",recu:"info",transmis:"primary",fermeture_temporaire:"warning",fermeture_definitive:"danger",annule:"danger",inactif:"secondary",verrouille:"danger",non_executee:"danger",cloture:"dark",maintien:"success"}[e]||"secondary";return`<span class="badge bg-${c}-subtle text-${c}-emphasis">${n}</span>`}function w({title:t,message:e,confirmLabel:n="Confirmer",danger:a=!1,onConfirm:c,onCancel:r}){let o=document.getElementById("globalConfirmDialog");o&&o.remove();const s=`
    <div class="modal fade show d-block" id="globalConfirmDialog" style="background: rgba(0,0,0,.45);" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${t}</h5>
            <button type="button" class="btn-close" id="confirmDialogCloseBtn" aria-label="Fermer"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">${e}</p>
          </div>
          <div class="modal-footer">
            <button type="button" className="btn btn-outline-secondary" id="confirmDialogCancelBtn">
              Annuler
            </button>
            <button type="button" class="btn ${a?"btn-danger":"btn-primary"}" id="confirmDialogOkBtn">
              ${n}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;document.body.insertAdjacentHTML("beforeend",s);const i=document.getElementById("globalConfirmDialog"),l=()=>{i.remove()};document.getElementById("confirmDialogCancelBtn").addEventListener("click",()=>{l(),r&&r()}),document.getElementById("confirmDialogCloseBtn").addEventListener("click",()=>{l(),r&&r()}),document.getElementById("confirmDialogOkBtn").addEventListener("click",()=>{l(),c&&c()})}let T={q:"",page:1,sortKey:null,sortDir:"asc",filterCommune:"",filterRegime:"",filterStatut:"",mode:"create",selectedId:null,form:{denomination:"",regime:"",idDinacope:"",numAgrement:"",numNotification:"",documents:[],adresse:{commune:"",quartier:"",avenue:"",numero:""},statut:"active"},errors:{}};function Dt(t){return t<1024?`${t} o`:`${Math.max(1,Math.round(t/1024))} Ko`}function Ce(){const t=m.ecoles,e=m.communes,n=m.regimes,a=t.filter(d=>{var u;return!(T.filterCommune&&((u=d.adresse)==null?void 0:u.commune)!==T.filterCommune||T.filterRegime&&d.regime!==T.filterRegime||T.filterStatut&&d.statut!==T.filterStatut)}),c=[{key:"denomination",header:"Dénomination",sortable:!0},{key:"regime",header:"Régime",sortable:!0},{key:"commune",header:"Commune",render:d=>{var u;return((u=d.adresse)==null?void 0:u.commune)||"—"}},{key:"idDinacope",header:"ID DINACOPE"},{key:"statut",header:"Statut",render:d=>V(ie,d.statut)},{key:"actions",header:"Actions",render:d=>`
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" title="Voir" data-action="view" data-id="${d.id}">
            <i class="ti ti-eye"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-primary" title="Modifier" data-action="edit" data-id="${d.id}">
            <i class="ti ti-edit"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" title="Supprimer" data-action="delete" data-id="${d.id}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `}],r=`
    <div class="row g-2">
      <div class="col-md-4">
        <select class="form-select" id="filterCommune">
          <option value="">Toutes les communes</option>
          ${e.map(d=>`<option value="${d.nom}" ${T.filterCommune===d.nom?"selected":""}>${d.nom}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-4">
        <select class="form-select" id="filterRegime">
          <option value="">Tous les régimes</option>
          ${n.map(d=>`<option value="${d.nom}" ${T.filterRegime===d.nom?"selected":""}>${d.nom}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-4">
        <select class="form-select" id="filterStatut">
          <option value="">Tous les statuts</option>
          ${Object.entries(ie).map(([d,u])=>`<option value="${d}" ${T.filterStatut===d?"selected":""}>${u}</option>`).join("")}
        </select>
      </div>
    </div>
  `,o=Q({columns:c,rows:a,searchKeys:["denomination","idDinacope","regime",d=>{var u;return((u=d.adresse)==null?void 0:u.commune)||""}],searchPlaceholder:"Rechercher une école (dénomination, commune, régime)…",emptyMessage:"Aucune école trouvée.",filtersHtml:r,q:T.q,page:T.page,sortKey:T.sortKey,sortDir:T.sortDir}),s=H({title:"Écoles",subtitle:"Gestion des établissements scolaires soumis au contrôle sanitaire.",actionsHtml:`
      <button type="button" class="btn btn-primary" id="openCreateBtn">
        <i class="ti ti-plus me-1"></i> Nouvelle école
      </button>
    `}),i=T.mode==="view",l=m.ecoles.find(d=>d.id===T.selectedId),p=l?m.fichesControle.filter(d=>d.ecoleId===l.id):[],I=T.mode==="create"?"Nouvelle école":T.mode==="edit"?"Modifier l'école":"Détail de l'école",g=`
    <form id="ecoleForm">
      <div class="row g-3">
        <div class="col-md-8">
          <label class="form-label">Dénomination ${i?"":'<span class="text-danger">*</span>'}</label>
          <input
            type="text"
            class="form-control"
            id="formDenomination"
            value="${T.form.denomination||""}"
            required
            ${i?"disabled":""}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Régime ${i?"":'<span class="text-danger">*</span>'}</label>
          <select class="form-select" id="formRegime" required ${i?"disabled":""}>
            <option value="">Sélectionner…</option>
            ${n.map(d=>`<option value="${d.nom}" ${T.form.regime===d.nom?"selected":""}>${d.nom}</option>`).join("")}
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">ID DINACOPE ${i?"":'<span class="text-danger">*</span>'}</label>
          <input
            type="text"
            class="form-control ${T.errors.idDinacope?"is-invalid":""}"
            id="formIdDinacope"
            value="${T.form.idDinacope||""}"
            required
            ${i?"disabled":""}
          />
          ${T.errors.idDinacope?`<div class="invalid-feedback">${T.errors.idDinacope}</div>`:""}
        </div>
        <div class="col-md-4">
          <label class="form-label">N° agrément</label>
          <input
            type="text"
            class="form-control"
            id="formNumAgrement"
            value="${T.form.numAgrement||""}"
            ${i?"disabled":""}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">N° notification</label>
          <input
            type="text"
            class="form-control"
            id="formNumNotification"
            value="${T.form.numNotification||""}"
            ${i?"disabled":""}
          />
        </div>

        <div class="col-12">
          <hr class="my-2" />
          <h6 class="mb-2">Adresse</h6>
        </div>
        <div class="col-md-3">
          <label class="form-label">Commune ${i?"":'<span class="text-danger">*</span>'}</label>
          <select class="form-select" id="formCommune" required ${i?"disabled":""}>
            <option value="">Sélectionner…</option>
            ${e.map(d=>`<option value="${d.nom}" ${T.form.adresse.commune===d.nom?"selected":""}>${d.nom}</option>`).join("")}
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Quartier</label>
          <input
            type="text"
            class="form-control"
            id="formQuartier"
            value="${T.form.adresse.quartier||""}"
            ${i?"disabled":""}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Avenue</label>
          <input
            type="text"
            class="form-control"
            id="formAvenue"
            value="${T.form.adresse.avenue||""}"
            ${i?"disabled":""}
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Numéro</label>
          <input
            type="text"
            class="form-control"
            id="formNumero"
            value="${T.form.adresse.numero||""}"
            ${i?"disabled":""}
          />
        </div>

        <div class="col-md-4">
          <label class="form-label">Statut ${i?"":'<span class="text-danger">*</span>'}</label>
          <select class="form-select" id="formStatut" required ${i?"disabled":""}>
            ${Object.entries(ie).map(([d,u])=>`<option value="${d}" ${T.form.statut===d?"selected":""}>${u}</option>`).join("")}
          </select>
        </div>

        <div class="col-12">
          <hr class="my-2" />
          <h6 class="mb-2">Documents</h6>
          ${i?"":'<input type="file" class="form-control mb-2" id="docFileInput" />'}
          ${T.form.documents&&T.form.documents.length>0?`
            <ul class="list-group" id="docList">
              ${T.form.documents.map((d,u)=>`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    <i class="ti ti-file-text me-2"></i>
                    ${d.nom} <span class="text-secondary small">(${d.taille})</span>
                  </span>
                  <span class="d-flex align-items-center gap-2">
                    <span class="text-secondary small">${_(d.date)}</span>
                    ${i?"":`<button type="button" class="btn btn-sm btn-outline-danger" data-remove-doc="${u}"><i class="ti ti-x"></i></button>`}
                  </span>
                </li>
              `).join("")}
            </ul>
          `:'<p class="text-secondary small mb-0">Aucun document joint.</p>'}
        </div>

        ${i?`
          <div class="col-12">
            <hr class="my-2" />
            <h6 class="mb-2">Historique des fiches de contrôle</h6>
            ${p.length===0?'<p class="text-secondary small mb-0">Aucune fiche de contrôle pour cette école.</p>':`
              <div class="table-responsive">
                <table class="table table-sm table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Numéro</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${p.map(d=>`
                      <tr>
                        <td>${d.numero}</td>
                        <td>${V({brouillon:"Brouillon",en_attente_validation:"En attente de validation",validee:"Validée (Lu et approuvé)"},d.statut)}</td>
                        <td>${_(d.createdAt)}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        `:""}
      </div>
    </form>
  `,v=Y({id:"ecoleModal",title:I,contentHtml:g,footerHtml:i?'<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>':`
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
      <button type="submit" form="ecoleForm" class="btn btn-primary">Enregistrer</button>
    `,size:"lg"});return`
    <div>
      ${s}
      ${o}
      ${v}
    </div>
  `}function De(t){if(!t)return;const e=()=>{t.innerHTML=Ce(),De(t)},n=(o,s=null)=>{T.mode=o,T.selectedId=(s==null?void 0:s.id)||null,T.errors={},s?T.form={denomination:s.denomination,regime:s.regime,idDinacope:s.idDinacope,numAgrement:s.numAgrement||"",numNotification:s.numNotification||"",documents:s.documents?[...s.documents]:[],adresse:{...s.adresse},statut:s.statut}:T.form={denomination:"",regime:"",idDinacope:"",numAgrement:"",numNotification:"",documents:[],adresse:{commune:"",quartier:"",avenue:"",numero:""},statut:"active"},e(),j("ecoleModal")};W(t,{onSearch:o=>{T.q=o,T.page=1,e()},onPageChange:o=>{T.page=o,e()},onSortChange:o=>{T.sortKey===o?T.sortDir=T.sortDir==="asc"?"desc":"asc":(T.sortKey=o,T.sortDir="asc"),e()},onActionClick:(o,s)=>{const i=m.ecoles.find(l=>l.id===s);o==="view"&&n("view",i),o==="edit"&&n("edit",i),o==="delete"&&w({title:"Supprimer l'école",message:"Voulez-vous vraiment supprimer cette école ? Cette action est irréversible.",confirmLabel:"Supprimer",danger:!0,onConfirm:()=>{m.deleteEcole(s)?e():w({title:"Suppression impossible",message:"Cette école ne peut pas être supprimée car des fiches ou rapports y sont liés. Voulez-vous la désactiver (fermeture temporaire) à la place ?",confirmLabel:"Désactiver",onConfirm:()=>{m.deactivateEcole(s),e()}})}})}});const a=t.querySelector("#openCreateBtn");a&&a.addEventListener("click",()=>n("create")),["filterCommune","filterRegime","filterStatut"].forEach(o=>{const s=t.querySelector(`#${o}`);s&&s.addEventListener("change",i=>{T[o]=i.target.value,T.page=1,e()})});const c=t.querySelector("#ecoleForm");c&&c.addEventListener("submit",o=>{o.preventDefault();const s=t.querySelector("#formIdDinacope").value.trim();if(m.ecoles.some(p=>p.idDinacope===s&&p.id!==T.selectedId)){T.errors={idDinacope:"Cet identifiant DINACOPE est déjà utilisé par une autre école."},e(),j("ecoleModal");return}const l={id:T.selectedId,denomination:t.querySelector("#formDenomination").value.trim(),regime:t.querySelector("#formRegime").value,idDinacope:s,numAgrement:t.querySelector("#formNumAgrement").value.trim()||null,numNotification:t.querySelector("#formNumNotification").value.trim()||null,documents:T.form.documents,adresse:{commune:t.querySelector("#formCommune").value,quartier:t.querySelector("#formQuartier").value.trim(),avenue:t.querySelector("#formAvenue").value.trim(),numero:t.querySelector("#formNumero").value.trim()},statut:t.querySelector("#formStatut").value};m.upsertEcole(l),X("ecoleModal"),e()});const r=t.querySelector("#docFileInput");r&&r.addEventListener("change",o=>{var i;const s=(i=o.target.files)==null?void 0:i[0];s&&(T.form.documents.push({nom:s.name,taille:Dt(s.size),date:new Date().toISOString()}),e(),j("ecoleModal"))}),t.querySelectorAll("[data-remove-doc]").forEach(o=>{o.addEventListener("click",()=>{const s=parseInt(o.getAttribute("data-remove-doc"),10);T.form.documents.splice(s,1),e(),j("ecoleModal")})})}let x={q:"",page:1,sortKey:null,sortDir:"asc",filterEcole:"",mode:"create",selectedId:null,form:{nomComplet:"",idDinacope:"",ancienneteEnseignement:"",ancienneteChef:"",ancienneteEcole:"",telephone:"",ecoleId:""}};function Se(){const t=m.chefs,e=m.ecoles,n=new Map(e.map(b=>[b.id,b])),a=t.filter(b=>!(x.filterEcole&&b.ecoleId!==x.filterEcole)),c=[{key:"nomComplet",header:"Nom complet",sortable:!0},{key:"idDinacope",header:"ID DINACOPE"},{key:"ecole",header:"École",render:b=>{var v;return((v=n.get(b.ecoleId))==null?void 0:v.denomination)||"—"}},{key:"telephone",header:"Téléphone",render:b=>b.telephone||"—"},{key:"ancienneteChef",header:"Ancienneté (chef)",sortable:!0},{key:"actions",header:"Actions",render:b=>`
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" title="Voir" data-action="view" data-id="${b.id}">
            <i class="ti ti-eye"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-primary" title="Modifier" data-action="edit" data-id="${b.id}">
            <i class="ti ti-edit"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" title="Supprimer" data-action="delete" data-id="${b.id}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `}],r=`
    <div class="row g-2">
      <div class="col-md-6">
        <select class="form-select" id="filterEcoleSelect">
          <option value="">Toutes les écoles</option>
          ${e.map(b=>`<option value="${b.id}" ${x.filterEcole===b.id?"selected":""}>${b.denomination}</option>`).join("")}
        </select>
      </div>
    </div>
  `,o=Q({columns:c,rows:a,searchKeys:["nomComplet","idDinacope",b=>{var v;return((v=n.get(b.ecoleId))==null?void 0:v.denomination)||""}],searchPlaceholder:"Rechercher par nom ou par école…",emptyMessage:"Aucun chef d'établissement trouvé.",filtersHtml:r,q:x.q,page:x.page,sortKey:x.sortKey,sortDir:x.sortDir}),s=H({title:"Chefs d'établissement",subtitle:"Gestion des responsables des établissements scolaires.",actionsHtml:`
      <button type="button" class="btn btn-primary" id="openCreateChefBtn">
        <i class="ti ti-plus me-1"></i> Nouveau chef
      </button>
    `}),i=x.mode==="view",l=x.mode==="create"?"Nouveau chef d'établissement":x.mode==="edit"?"Modifier le chef d'établissement":"Détail du chef d'établissement",p=`
    <form id="chefForm">
      <div class="row g-3">
        <div class="col-md-8">
          <label class="form-label">Nom complet ${i?"":'<span class="text-danger">*</span>'}</label>
          <input
            type="text"
            class="form-control"
            id="formNomComplet"
            value="${x.form.nomComplet||""}"
            required
            ${i?"disabled":""}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">ID DINACOPE ${i?"":'<span class="text-danger">*</span>'}</label>
          <input
            type="text"
            class="form-control"
            id="formIdDinacope"
            value="${x.form.idDinacope||""}"
            required
            ${i?"disabled":""}
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">École ${i?"":'<span class="text-danger">*</span>'}</label>
          <select class="form-select" id="formEcoleId" required ${i?"disabled":""}>
            <option value="">Sélectionner…</option>
            ${e.map(b=>`<option value="${b.id}" ${x.form.ecoleId===b.id?"selected":""}>${b.denomination}</option>`).join("")}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Téléphone</label>
          <input
            type="tel"
            class="form-control"
            id="formTelephone"
            value="${x.form.telephone||""}"
            ${i?"disabled":""}
          />
        </div>

        <div class="col-12">
          <hr class="my-2" />
          <h6 class="mb-2">Ancienneté (en années)</h6>
        </div>
        <div class="col-md-4">
          <label class="form-label">Enseignement</label>
          <input
            type="number"
            min="0"
            class="form-control"
            id="formAncienneteEnseignement"
            value="${x.form.ancienneteEnseignement??""}"
            ${i?"disabled":""}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">En tant que chef</label>
          <input
            type="number"
            min="0"
            class="form-control"
            id="formAncienneteChef"
            value="${x.form.ancienneteChef??""}"
            ${i?"disabled":""}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Dans cette école</label>
          <input
            type="number"
            min="0"
            class="form-control"
            id="formAncienneteEcole"
            value="${x.form.ancienneteEcole??""}"
            ${i?"disabled":""}
          />
        </div>
      </div>
    </form>
  `,g=Y({id:"chefModal",title:l,contentHtml:p,footerHtml:i?'<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>':`
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
      <button type="submit" form="chefForm" class="btn btn-primary">Enregistrer</button>
    `,size:"lg"});return`
    <div>
      ${s}
      ${o}
      ${g}
    </div>
  `}function $e(t){if(!t)return;const e=()=>{t.innerHTML=Se(),$e(t)},n=(o,s=null)=>{x.mode=o,x.selectedId=(s==null?void 0:s.id)||null,s?x.form={nomComplet:s.nomComplet,idDinacope:s.idDinacope,ancienneteEnseignement:s.ancienneteEnseignement??"",ancienneteChef:s.ancienneteChef??"",ancienneteEcole:s.ancienneteEcole??"",telephone:s.telephone||"",ecoleId:s.ecoleId||""}:x.form={nomComplet:"",idDinacope:"",ancienneteEnseignement:"",ancienneteChef:"",ancienneteEcole:"",telephone:"",ecoleId:""},e(),j("chefModal")};W(t,{onSearch:o=>{x.q=o,x.page=1,e()},onPageChange:o=>{x.page=o,e()},onSortChange:o=>{x.sortKey===o?x.sortDir=x.sortDir==="asc"?"desc":"asc":(x.sortKey=o,x.sortDir="asc"),e()},onActionClick:(o,s)=>{const i=m.chefs.find(l=>l.id===s);o==="view"&&n("view",i),o==="edit"&&n("edit",i),o==="delete"&&w({title:"Supprimer le chef d'établissement",message:"Voulez-vous vraiment supprimer ce chef d'établissement ? Cette action est irréversible.",confirmLabel:"Supprimer",danger:!0,onConfirm:()=>{m.deleteChef(s),e()}})}});const a=t.querySelector("#openCreateChefBtn");a&&a.addEventListener("click",()=>n("create"));const c=t.querySelector("#filterEcoleSelect");c&&c.addEventListener("change",o=>{x.filterEcole=o.target.value,x.page=1,e()});const r=t.querySelector("#chefForm");r&&r.addEventListener("submit",o=>{o.preventDefault();const s={id:x.selectedId,nomComplet:t.querySelector("#formNomComplet").value.trim(),idDinacope:t.querySelector("#formIdDinacope").value.trim(),ecoleId:t.querySelector("#formEcoleId").value||null,telephone:t.querySelector("#formTelephone").value.trim()||null,ancienneteEnseignement:Number(t.querySelector("#formAncienneteEnseignement").value)||0,ancienneteChef:Number(t.querySelector("#formAncienneteChef").value)||0,ancienneteEcole:Number(t.querySelector("#formAncienneteEcole").value)||0};m.upsertChef(s),X("chefModal"),e()})}let D={q:"",page:1,sortKey:null,sortDir:"asc",filterRole:"",filterStatut:"",mode:"create",selectedId:null,form:{nom:"",contact:"",telephone:"",role:le[0],equipe:"",statut:"actif",identifiant:"",motDePasse:""}};function Me(){const e=m.utilisateurs.filter(g=>!(D.filterRole&&g.role!==D.filterRole||D.filterStatut&&g.statut!==D.filterStatut)),n=[{key:"nom",header:"Nom",sortable:!0},{key:"identifiant",header:"Identifiant"},{key:"role",header:"Rôle",sortable:!0},{key:"equipe",header:"Équipe",render:g=>g.equipe||"—"},{key:"contact",header:"Contact"},{key:"statut",header:"Statut",render:g=>V(me,g.statut)},{key:"actions",header:"Actions",render:g=>`
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" title="Voir" data-action="view" data-id="${g.id}">
            <i class="ti ti-eye"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-primary" title="Modifier" data-action="edit" data-id="${g.id}">
            <i class="ti ti-edit"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-warning" title="Réinitialiser le mot de passe" data-action="reset" data-id="${g.id}">
            <i class="ti ti-key"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" title="Supprimer" data-action="delete" data-id="${g.id}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `}],a=`
    <div class="row g-2">
      <div class="col-md-6">
        <select class="form-select" id="filterRoleSelect">
          <option value="">Tous les rôles</option>
          ${le.map(g=>`<option value="${g}" ${D.filterRole===g?"selected":""}>${g}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-6">
        <select class="form-select" id="filterUserStatutSelect">
          <option value="">Tous les statuts</option>
          ${Object.entries(me).map(([g,b])=>`<option value="${g}" ${D.filterStatut===g?"selected":""}>${b}</option>`).join("")}
        </select>
      </div>
    </div>
  `,c=Q({columns:n,rows:e,searchKeys:["nom","identifiant","contact"],searchPlaceholder:"Rechercher un utilisateur…",emptyMessage:"Aucun utilisateur trouvé.",filtersHtml:a,q:D.q,page:D.page,sortKey:D.sortKey,sortDir:D.sortDir}),r=H({title:"Utilisateurs",subtitle:"Gestion des comptes d'accès à la plateforme Inspect-San.",actionsHtml:`
      <button type="button" class="btn btn-primary" id="openCreateUserBtn">
        <i class="ti ti-plus me-1"></i> Nouvel utilisateur
      </button>
    `}),o=D.mode==="view",s=m.utilisateurs.find(g=>g.id===D.selectedId),i=D.mode==="create"?"Nouvel utilisateur":D.mode==="edit"?"Modifier l'utilisateur":"Détail de l'utilisateur",l=`
    <form id="userForm">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Nom ${o?"":'<span class="text-danger">*</span>'}</label>
          <input
            type="text"
            class="form-control"
            id="formNom"
            value="${D.form.nom||""}"
            required
            ${o?"disabled":""}
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Contact (e-mail) ${o?"":'<span class="text-danger">*</span>'}</label>
          <input
            type="email"
            class="form-control"
            id="formContact"
            value="${D.form.contact||""}"
            required
            ${o?"disabled":""}
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">Téléphone</label>
          <input
            type="tel"
            class="form-control"
            id="formTelephone"
            value="${D.form.telephone||""}"
            ${o?"disabled":""}
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Rôle ${o?"":'<span class="text-danger">*</span>'}</label>
          <select class="form-select" id="formRole" required ${o?"disabled":""}>
            ${le.map(g=>`<option value="${g}" ${D.form.role===g?"selected":""}>${g}</option>`).join("")}
          </select>
        </div>

        <div class="col-md-6 ${D.form.role==="Contrôleur"?"":"d-none"}" id="equipeContainer">
          <label class="form-label">Équipe</label>
          <input
            type="text"
            class="form-control"
            list="equipes-list"
            id="formEquipe"
            value="${D.form.equipe||""}"
            placeholder="Sélectionner ou saisir une équipe"
            ${o?"disabled":""}
          />
          <datalist id="equipes-list">
            ${rt.map(g=>`<option value="${g.nom}"></option>`).join("")}
          </datalist>
        </div>

        <div class="col-md-6">
          <label class="form-label">Identifiant ${o?"":'<span class="text-danger">*</span>'}</label>
          <input
            type="text"
            class="form-control"
            id="formIdentifiant"
            value="${D.form.identifiant||""}"
            required
            ${o?"disabled":""}
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Statut ${o?"":'<span class="text-danger">*</span>'}</label>
          <select class="form-select" id="formStatut" required ${o?"disabled":""}>
            ${Object.entries(me).map(([g,b])=>`<option value="${g}" ${D.form.statut===g?"selected":""}>${b}</option>`).join("")}
          </select>
        </div>

        ${D.mode==="create"?`
          <div class="col-md-6">
            <label class="form-label">Mot de passe</label>
            <input
              type="password"
              class="form-control"
              id="formMotDePasse"
              value="${D.form.motDePasse||""}"
              placeholder="Laisser vide pour générer un mot de passe par défaut"
            />
            <div class="form-text">
              Optionnel : si vide, un mot de passe par défaut sera attribué.
            </div>
          </div>
        `:""}

        ${o?`
          <div class="col-12">
            <hr class="my-2" />
            <p class="text-secondary small mb-0">
              Créé le ${_(s==null?void 0:s.createdAt)}. Utilisez l'action « Réinitialiser » depuis le
              tableau pour changer le mot de passe de cet utilisateur.
            </p>
          </div>
        `:""}
      </div>
    </form>
  `,I=Y({id:"userModal",title:i,contentHtml:l,footerHtml:o?'<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>':`
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
      <button type="submit" form="userForm" class="btn btn-primary">Enregistrer</button>
    `,size:"lg"});return`
    <div>
      ${r}
      ${c}
      ${I}
    </div>
  `}function Le(t){if(!t)return;const e=()=>{t.innerHTML=Me(),Le(t)},n=(i,l=null)=>{D.mode=i,D.selectedId=(l==null?void 0:l.id)||null,l?D.form={nom:l.nom,contact:l.contact,telephone:l.telephone||"",role:l.role,equipe:l.equipe||"",statut:l.statut,identifiant:l.identifiant,motDePasse:""}:D.form={nom:"",contact:"",telephone:"",role:le[0],equipe:"",statut:"actif",identifiant:"",motDePasse:""},e(),j("userModal")};W(t,{onSearch:i=>{D.q=i,D.page=1,e()},onPageChange:i=>{D.page=i,e()},onSortChange:i=>{D.sortKey===i?D.sortDir=D.sortDir==="asc"?"desc":"asc":(D.sortKey=i,D.sortDir="asc"),e()},onActionClick:(i,l)=>{const p=m.utilisateurs.find(I=>I.id===l);i==="view"&&n("view",p),i==="edit"&&n("edit",p),i==="reset"&&w({title:"Réinitialiser le mot de passe",message:"Voulez-vous réinitialiser le mot de passe de cet utilisateur ? Un nouveau mot de passe temporaire sera généré.",confirmLabel:"Réinitialiser",onConfirm:()=>{m.resetPassword(l),e()}}),i==="delete"&&w({title:"Supprimer l'utilisateur",message:"Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.",confirmLabel:"Supprimer",danger:!0,onConfirm:()=>{m.deleteUtilisateur(l),e()}})}});const a=t.querySelector("#openCreateUserBtn");a&&a.addEventListener("click",()=>n("create"));const c=t.querySelector("#filterRoleSelect");c&&c.addEventListener("change",i=>{D.filterRole=i.target.value,D.page=1,e()});const r=t.querySelector("#filterUserStatutSelect");r&&r.addEventListener("change",i=>{D.filterStatut=i.target.value,D.page=1,e()});const o=t.querySelector("#formRole");o&&o.addEventListener("change",i=>{D.form.role=i.target.value;const l=t.querySelector("#equipeContainer");l&&(i.target.value==="Contrôleur"?l.classList.remove("d-none"):l.classList.add("d-none"))});const s=t.querySelector("#userForm");s&&s.addEventListener("submit",i=>{var p,I;i.preventDefault();const l={id:D.selectedId,nom:t.querySelector("#formNom").value.trim(),contact:t.querySelector("#formContact").value.trim(),telephone:t.querySelector("#formTelephone").value.trim()||null,role:t.querySelector("#formRole").value,equipe:t.querySelector("#formRole").value==="Contrôleur"&&((p=t.querySelector("#formEquipe"))==null?void 0:p.value.trim())||null,statut:t.querySelector("#formStatut").value,identifiant:t.querySelector("#formIdentifiant").value.trim()};if(D.mode==="create"){const g=(I=t.querySelector("#formMotDePasse"))==null?void 0:I.value.trim();g&&(l.motDePasse=g)}m.upsertUtilisateur(l),X("userModal"),e()})}let F={q:"",page:1,sortKey:null,sortDir:"asc",filterStatut:"",form:{id:null,numero:"",ecoleId:"",controleurIds:[],dateEmission:"",validiteDebut:"",validiteFin:"",statut:"en_attente_signature"}};function pe(t){return t?String(t).slice(0,10):""}function Ne(){const t=m.currentUser,e=m.ordresMission,n=m.ecoles,a=m.utilisateurs,c=new Map(n.map(h=>[h.id,h])),r=new Map(a.map(h=>[h.id,h])),o=e.filter(h=>!(F.filterStatut&&h.statut!==F.filterStatut)),s=(t==null?void 0:t.role)==="Directeur Provincial",i=[{key:"numero",header:"N° Ordre",sortable:!0},{key:"ecole",header:"École",render:h=>{var Z;return((Z=c.get(h.ecoleId))==null?void 0:Z.denomination)||"—"}},{key:"controleurs",header:"Contrôleur(s)",render:h=>(h.controleurIds||[]).map(Z=>{var E;return((E=r.get(Z))==null?void 0:E.nom)||Z}).join(", ")||"—"},{key:"dateEmission",header:"Date d'émission",sortable:!0,render:h=>_(h.dateEmission)},{key:"validite",header:"Validité",render:h=>`${_(h.validiteDebut)} → ${_(h.validiteFin)}`},{key:"statut",header:"Statut",sortable:!0,render:h=>V(ae,h.statut)},{key:"actions",header:"Actions",render:h=>`
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-icon btn-outline-primary" title="Modifier" data-action="edit" data-id="${h.id}">
            <i class="ti ti-edit"></i>
          </button>
          ${s&&h.statut==="en_attente_signature"?`<button type="button" class="btn btn-sm btn-success" data-action="signer" data-id="${h.id}">
                  <i class="ti ti-signature me-1"></i> Signer
                </button>`:""}
          <button type="button" class="btn btn-sm btn-icon btn-outline-secondary" title="Générer le PDF" data-action="print" data-id="${h.id}">
            <i class="ti ti-file-download"></i>
          </button>
          <button type="button" class="btn btn-sm btn-icon btn-outline-danger" title="Supprimer" data-action="delete" data-id="${h.id}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `}],l=`
    <select class="form-select" id="filterOrdreStatut">
      <option value="">Tous les statuts</option>
      ${Object.entries(ae).map(([h,Z])=>`<option value="${h}" ${F.filterStatut===h?"selected":""}>${Z}</option>`).join("")}
    </select>
  `,p=Q({columns:i,rows:o,searchKeys:["numero",h=>{var Z;return((Z=c.get(h.ecoleId))==null?void 0:Z.denomination)||""}],searchPlaceholder:"Rechercher un ordre, une école…",emptyMessage:"Aucun ordre de mission trouvé.",filtersHtml:l,q:F.q,page:F.page,sortKey:F.sortKey,sortDir:F.sortDir}),I=H({title:"Ordres de mission",subtitle:"Émission, signature et suivi des ordres de mission de contrôle sanitaire",actionsHtml:`
      <button type="button" class="btn btn-primary" id="openCreateOrdreBtn">
        <i class="ti ti-plus me-1"></i> Nouvel ordre de mission
      </button>
    `}),g=a.filter(h=>h.role==="Contrôleur"),b=F.form.id?"Modifier l'ordre de mission":"Nouvel ordre de mission",v=`
    <form id="ordreForm">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">N° de l'ordre</label>
          <input
            type="text"
            class="form-control"
            id="formNumero"
            value="${F.form.numero||""}"
            placeholder="Généré automatiquement si laissé vide"
            ${F.form.id?"disabled":""}
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">École <span class="text-danger">*</span></label>
          <select class="form-select" id="formEcoleId" required>
            <option value="">Sélectionner une école…</option>
            ${n.map(h=>`<option value="${h.id}" ${F.form.ecoleId===h.id?"selected":""}>${h.denomination}</option>`).join("")}
          </select>
        </div>

        <div class="col-12">
          <label class="form-label">Contrôleur(s) affecté(s) <span class="text-danger">*</span></label>
          <div class="row border rounded p-3">
            ${g.length===0?'<p class="text-secondary mb-0">Aucun contrôleur disponible.</p>':g.map(h=>`
                <div class="col-md-4 col-sm-6">
                  <div class="form-check">
                    <input
                      class="form-check-input ctrl-check"
                      type="checkbox"
                      id="ctrl-${h.id}"
                      value="${h.id}"
                      ${F.form.controleurIds.includes(h.id)?"checked":""}
                    />
                    <label class="form-check-label" for="ctrl-${h.id}">
                      ${h.nom} ${h.equipe?`(${h.equipe})`:""}
                    </label>
                  </div>
                </div>
              `).join("")}
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label">Date d'émission</label>
          <input
            type="date"
            class="form-control"
            id="formDateEmission"
            value="${F.form.dateEmission||""}"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Début de validité</label>
          <input
            type="date"
            class="form-control"
            id="formValiditeDebut"
            value="${F.form.validiteDebut||""}"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Fin de validité</label>
          <input
            type="date"
            class="form-control"
            id="formValiditeFin"
            value="${F.form.validiteFin||""}"
          />
        </div>

        ${F.form.id?`
          <div class="col-md-6">
            <label class="form-label">Statut</label>
            <select class="form-select" id="formStatut">
              ${Object.entries(ae).map(([h,Z])=>`<option value="${h}" ${F.form.statut===h?"selected":""}>${Z}</option>`).join("")}
            </select>
            <div class="form-text">
              La signature officielle se fait via le bouton « Signer » depuis le tableau.
            </div>
          </div>
        `:""}
      </div>
    </form>
  `,u=Y({id:"ordreModal",title:b,contentHtml:v,footerHtml:`
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
    <button type="submit" form="ordreForm" class="btn btn-primary">Enregistrer</button>
  `,size:"lg"});return`
    <div>
      ${I}
      ${p}
      ${u}
    </div>
  `}function xe(t){if(!t)return;const e=()=>{t.innerHTML=Ne(),xe(t)},n=(o=null)=>{o?F.form={id:o.id,numero:o.numero||"",ecoleId:o.ecoleId||"",controleurIds:o.controleurIds?[...o.controleurIds]:[],dateEmission:pe(o.dateEmission),validiteDebut:pe(o.validiteDebut),validiteFin:pe(o.validiteFin),statut:o.statut||"en_attente_signature"}:F.form={id:null,numero:"",ecoleId:"",controleurIds:[],dateEmission:"",validiteDebut:"",validiteFin:"",statut:"en_attente_signature"},e(),j("ordreModal")};W(t,{onSearch:o=>{F.q=o,F.page=1,e()},onPageChange:o=>{F.page=o,e()},onSortChange:o=>{F.sortKey===o?F.sortDir=F.sortDir==="asc"?"desc":"asc":(F.sortKey=o,F.sortDir="asc"),e()},onActionClick:(o,s)=>{var l,p,I,g,b;const i=m.ordresMission.find(v=>v.id===s);if(o==="edit"&&n(i),o==="signer"&&w({title:"Signer l'ordre de mission",message:"En tant que Directeur Provincial, vous confirmez la signature officielle de cet ordre de mission.",confirmLabel:"Signer",onConfirm:()=>{m.signerOrdre(s),e()}}),o==="delete"&&w({title:"Supprimer l'ordre de mission",message:"Cette action est irréversible. Confirmez-vous la suppression de cet ordre de mission ?",confirmLabel:"Supprimer",danger:!0,onConfirm:()=>{m.deleteOrdre(s),e()}}),o==="print"){const v=m.ecoles.find(Z=>Z.id===i.ecoleId),d=(i.controleurIds||[]).map(Z=>{var E;return((E=m.utilisateurs.find(N=>N.id===Z))==null?void 0:E.nom)||Z}).join(", "),u=i.signePar?(l=m.utilisateurs.find(Z=>Z.id===i.signePar))==null?void 0:l.nom:null,h=`
          <h2>Ordre de mission ${i.numero}</h2>
          <p class="text-secondary">Province Éducationnelle de Kinshasa / Mont-Amba — Contrôle sanitaire scolaire</p>
          <table class="table table-bordered">
            <tbody>
              <tr><th style="width:220px">École</th><td>${(v==null?void 0:v.denomination)||"—"}</td></tr>
              <tr><th>Adresse</th><td>${v?`${((p=v.adresse)==null?void 0:p.avenue)||""} n°${((I=v.adresse)==null?void 0:I.numero)||""}, ${((g=v.adresse)==null?void 0:g.quartier)||""}, ${((b=v.adresse)==null?void 0:b.commune)||""}`:"—"}</td></tr>
              <tr><th>Contrôleur(s) désigné(s)</th><td>${d||"—"}</td></tr>
              <tr><th>Date d'émission</th><td>${_(i.dateEmission)}</td></tr>
              <tr><th>Période de validité</th><td>Du ${_(i.validiteDebut)} au ${_(i.validiteFin)}</td></tr>
              <tr><th>Statut</th><td>${ae[i.statut]||i.statut}</td></tr>
              <tr><th>Signé par</th><td>${u||"—"}</td></tr>
              <tr><th>Signé le</th><td>${z(i.signeLe)}</td></tr>
            </tbody>
          </table>
        `;de(`Ordre de mission ${i.numero}`,h)}}});const a=t.querySelector("#openCreateOrdreBtn");a&&a.addEventListener("click",()=>n(null));const c=t.querySelector("#filterOrdreStatut");c&&c.addEventListener("change",o=>{F.filterStatut=o.target.value,F.page=1,e()});const r=t.querySelector("#ordreForm");r&&r.addEventListener("submit",o=>{var v,d;o.preventDefault();const s=t.querySelector("#formEcoleId").value,i=Array.from(t.querySelectorAll(".ctrl-check:checked")).map(u=>u.value);if(!s){m.pushToast("Veuillez sélectionner une école.","danger");return}if(i.length===0){m.pushToast("Veuillez sélectionner au moins un contrôleur.","danger");return}const l=t.querySelector("#formValiditeDebut").value,p=t.querySelector("#formValiditeFin").value,I=t.querySelector("#formDateEmission").value,g=(v=t.querySelector("#formNumero"))==null?void 0:v.value.trim(),b={id:F.form.id||void 0,numero:g||void 0,ecoleId:s,controleurIds:i,dateEmission:I?new Date(I).toISOString():new Date().toISOString(),validiteDebut:l?new Date(l).toISOString():null,validiteFin:p?new Date(p).toISOString():null,statut:F.form.id?((d=t.querySelector("#formStatut"))==null?void 0:d.value)||F.form.statut:"en_attente_signature"};m.upsertOrdre(b),X("ordreModal"),e()})}const St=["Bon","Moyen","Dégradé","Critique"],ve=["Javel","Savon","Balais","Seaux"],oe=["Maintien avec recommandations","Réhabilitation partielle","Fermeture temporaire proposée","Suivi renforcé"];function $t(){return`ph-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`}let y={q:"",page:1,sortKey:null,sortDir:"asc",filterStatut:"",form:{id:null,numero:"",ordreMissionId:"",ecoleId:"",chefId:"",statut:"brouillon",sectionBatiments:{nombreBatiments:"",etatGeneral:"Bon",toilettesFilles:"",toilettesGarcons:"",nombreEleves:""},sectionImpact7:{montantPercu:"",produitsNettoyage:[],quantite:""},produitsAutres:"",observations:"",recommandationPreliminaire:oe[0],photos:[]}};function Fe(){var A;const t=m.currentUser,e=m.fichesControle,n=m.ordresMission,a=m.ecoles,c=m.chefs,r=new Map(a.map(f=>[f.id,f])),o=new Map(c.map(f=>[f.id,f])),s=new Map(n.map(f=>[f.id,f])),i=e.filter(f=>!(y.filterStatut&&f.statut!==y.filterStatut)),l=(t==null?void 0:t.role)==="Chef d'établissement",p=[{key:"numero",header:"N° Fiche",sortable:!0},{key:"ordreMission",header:"N° OM",render:f=>{var M;return((M=s.get(f.ordreMissionId))==null?void 0:M.numero)||"—"}},{key:"ecole",header:"École",render:f=>{var M;return((M=r.get(f.ecoleId))==null?void 0:M.denomination)||"—"}},{key:"chef",header:"Chef d'étab.",render:f=>{var M;return((M=o.get(f.chefId))==null?void 0:M.nomComplet)||"—"}},{key:"createdAt",header:"Date",sortable:!0,render:f=>_(f.createdAt)},{key:"statut",header:"Statut",sortable:!0,render:f=>V(re,f.statut)},{key:"actions",header:"Actions",render:f=>`
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-icon btn-outline-primary" title="Editer / Voir" data-action="edit" data-id="${f.id}">
            <i class="ti ti-edit"></i>
          </button>
          ${l&&f.statut==="en_attente_validation"?`<button type="button" class="btn btn-sm btn-success" data-action="valider" data-id="${f.id}">
                  <i class="ti ti-check me-1"></i> Valider
                </button>`:""}
          <button type="button" class="btn btn-sm btn-icon btn-outline-secondary" title="Générer le PDF" data-action="print" data-id="${f.id}">
            <i class="ti ti-file-download"></i>
          </button>
          <button type="button" class="btn btn-sm btn-icon btn-outline-danger" title="Supprimer" data-action="delete" data-id="${f.id}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `}],I=`
    <select class="form-select" id="filterFicheStatut">
      <option value="">Tous les statuts</option>
      ${Object.entries(re).map(([f,M])=>`<option value="${f}" ${y.filterStatut===f?"selected":""}>${M}</option>`).join("")}
    </select>
  `,g=Q({columns:p,rows:i,searchKeys:["numero",f=>{var M;return((M=r.get(f.ecoleId))==null?void 0:M.denomination)||""}],searchPlaceholder:"Rechercher une fiche, une école…",emptyMessage:"Aucune fiche de contrôle trouvée.",filtersHtml:I,q:y.q,page:y.page,sortKey:y.sortKey,sortDir:y.sortDir}),b=H({title:"Fiches de contrôle",subtitle:"Saisie et validation des fiches de contrôle sanitaire scolaire",actionsHtml:`
      <button type="button" class="btn btn-primary" id="openCreateFicheBtn">
        <i class="ti ti-plus me-1"></i> Nouvelle fiche de contrôle
      </button>
    `}),v=y.form.statut==="validee";s.get(y.form.ordreMissionId);const d=r.get(y.form.ecoleId),u=o.get(y.form.chefId),h=y.form.id?`Fiche ${y.form.numero}`:"Nouvelle fiche de contrôle",Z=`
    <form id="ficheForm">
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <label class="form-label">Ordre de mission <span class="text-danger">*</span></label>
          <select class="form-select" id="formOrdreMissionId" required ${v?"disabled":""}>
            <option value="">Sélectionner un OM…</option>
            ${n.map(f=>{var M;return`<option value="${f.id}" ${y.form.ordreMissionId===f.id?"selected":""}>${f.numero} — ${((M=r.get(f.ecoleId))==null?void 0:M.denomination)||""} (${ae[f.statut]||f.statut})</option>`}).join("")}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Statut</label>
          <select class="form-select" id="formStatut" ${v?"disabled":""}>
            ${Object.entries(re).map(([f,M])=>`<option value="${f}" ${y.form.statut===f?"selected":""}>${M}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="card bg-light border mb-4">
        <div class="card-body">
          <h6 class="card-title mb-2">Informations associées</h6>
          <div class="row g-2 small text-secondary">
            <div class="col-md-6">
              <strong>École :</strong> ${d?d.denomination:"—"}
            </div>
            <div class="col-md-6">
              <strong>Commune :</strong> ${((A=d==null?void 0:d.adresse)==null?void 0:A.commune)||"—"}
            </div>
            <div class="col-md-6">
              <strong>Chef d'établissement :</strong> ${u?u.nomComplet:"—"}
            </div>
            <div class="col-md-6">
              <strong>ID DINACOPE :</strong> ${(d==null?void 0:d.idDinacope)||"—"}
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><h6 class="mb-0">Section Bâtiments & Infrastructures</h6></div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Nombre de bâtiments</label>
              <input
                type="number"
                min="0"
                class="form-control"
                id="formNombreBatiments"
                value="${y.form.sectionBatiments.nombreBatiments}"
                ${v?"disabled":""}
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">État général</label>
              <select class="form-select" id="formEtatGeneral" ${v?"disabled":""}>
                ${St.map(f=>`<option value="${f}" ${y.form.sectionBatiments.etatGeneral===f?"selected":""}>${f}</option>`).join("")}
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Nombre d'élèves</label>
              <input
                type="number"
                min="0"
                class="form-control"
                id="formNombreEleves"
                value="${y.form.sectionBatiments.nombreEleves}"
                ${v?"disabled":""}
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Toilettes Filles (nombre / état)</label>
              <input
                type="text"
                class="form-control"
                id="formToilettesFilles"
                value="${y.form.sectionBatiments.toilettesFilles}"
                placeholder="Ex. 4 fonctionnelles"
                ${v?"disabled":""}
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Toilettes Garçons (nombre / état)</label>
              <input
                type="text"
                class="form-control"
                id="formToilettesGarcons"
                value="${y.form.sectionBatiments.toilettesGarcons}"
                placeholder="Ex. 3 fonctionnelles"
                ${v?"disabled":""}
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><h6 class="mb-0">Section Frais de fonctionnement (Impact 7$)</h6></div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Montant perçu (FC / $)</label>
              <input
                type="text"
                class="form-control"
                id="formMontantPercu"
                value="${y.form.sectionImpact7.montantPercu}"
                placeholder="Ex. 140 000 FC"
                ${v?"disabled":""}
              />
            </div>
            <div class="col-md-8">
              <label class="form-label">Produits de nettoyage achetés</label>
              <div class="d-flex flex-wrap gap-3 mt-1">
                ${ve.map(f=>`
                  <div class="form-check">
                    <input
                      class="form-check-input produit-check"
                      type="checkbox"
                      id="prod-${f}"
                      value="${f}"
                      ${y.form.sectionImpact7.produitsNettoyage.includes(f)?"checked":""}
                      ${v?"disabled":""}
                    />
                    <label class="form-check-label" for="prod-${f}">${f}</label>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Autres produits</label>
              <input
                type="text"
                class="form-control"
                id="formProduitsAutres"
                value="${y.form.produitsAutres}"
                placeholder="Séparés par des virgules"
                ${v?"disabled":""}
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Quantité / Précisions</label>
              <input
                type="text"
                class="form-control"
                id="formQuantite"
                value="${y.form.sectionImpact7.quantite}"
                placeholder="Ex. 10L Javel, 2 cartons de savon"
                ${v?"disabled":""}
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><h6 class="mb-0">Observations & Recommandation</h6></div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Observations générales</label>
              <textarea
                class="form-control"
                rows="3"
                id="formObservations"
                ${v?"disabled":""}
              >${y.form.observations}</textarea>
            </div>
            <div class="col-12">
              <label class="form-label">Recommandation préliminaire</label>
              <select class="form-select" id="formRecommandationPreliminaire" ${v?"disabled":""}>
                ${oe.map(f=>`<option value="${f}" ${y.form.recommandationPreliminaire===f?"selected":""}>${f}</option>`).join("")}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Photos constatées sur le terrain</h6>
          ${v?"":`<label class="btn btn-sm btn-outline-primary mb-0">
                  <i class="ti ti-camera me-1"></i> Ajouter photo
                  <input type="file" id="photoFileInput" accept="image/*" class="d-none" />
                </label>`}
        </div>
        <div class="card-body">
          ${y.form.photos.length===0?'<p class="text-secondary small mb-0">Aucune photo jointe.</p>':`
            <div class="row g-3" id="photoList">
              ${y.form.photos.map((f,M)=>`
                <div class="col-md-6 col-lg-4">
                  <div class="border rounded p-2 text-center position-relative">
                    <img src="${f.url}" alt="${f.legende}" class="img-fluid rounded mb-2" style="max-height: 140px; object-fit: cover;" />
                    <p class="small text-muted mb-0">${f.legende}</p>
                    ${v?"":`<button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" data-remove-photo="${M}">
                            <i class="ti ti-x"></i>
                          </button>`}
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    </form>
  `,N=Y({id:"ficheModal",title:h,contentHtml:Z,footerHtml:v?'<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>':`
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
      <button type="submit" form="ficheForm" class="btn btn-primary">Enregistrer</button>
    `,size:"lg"});return`
    <div>
      ${b}
      ${g}
      ${N}
    </div>
  `}function qe(t){if(!t)return;const e=()=>{t.innerHTML=Fe(),qe(t)},n=(i=null)=>{var l,p,I,g,b,v,d,u;if(i){const h=((l=i.sectionImpact7)==null?void 0:l.produitsNettoyage)||[],Z=h.filter(N=>ve.includes(N)),E=h.filter(N=>!ve.includes(N));y.form={id:i.id,numero:i.numero||"",ordreMissionId:i.ordreMissionId||"",ecoleId:i.ecoleId||"",chefId:i.chefId||"",statut:i.statut||"brouillon",sectionBatiments:{nombreBatiments:((p=i.sectionBatiments)==null?void 0:p.nombreBatiments)??"",etatGeneral:((I=i.sectionBatiments)==null?void 0:I.etatGeneral)||"Bon",toilettesFilles:((g=i.sectionBatiments)==null?void 0:g.toilettesFilles)??"",toilettesGarcons:((b=i.sectionBatiments)==null?void 0:b.toilettesGarcons)??"",nombreEleves:((v=i.sectionBatiments)==null?void 0:v.nombreEleves)??""},sectionImpact7:{montantPercu:((d=i.sectionImpact7)==null?void 0:d.montantPercu)??"",produitsNettoyage:Z,quantite:((u=i.sectionImpact7)==null?void 0:u.quantite)||""},produitsAutres:E.join(", "),observations:i.observations||"",recommandationPreliminaire:i.recommandationPreliminaire||oe[0],photos:i.photos?[...i.photos]:[]}}else y.form={id:null,numero:"",ordreMissionId:"",ecoleId:"",chefId:"",statut:"brouillon",sectionBatiments:{nombreBatiments:"",etatGeneral:"Bon",toilettesFilles:"",toilettesGarcons:"",nombreEleves:""},sectionImpact7:{montantPercu:"",produitsNettoyage:[],quantite:""},produitsAutres:"",observations:"",recommandationPreliminaire:oe[0],photos:[]};e(),j("ficheModal")};W(t,{onSearch:i=>{y.q=i,y.page=1,e()},onPageChange:i=>{y.page=i,e()},onSortChange:i=>{y.sortKey===i?y.sortDir=y.sortDir==="asc"?"desc":"asc":(y.sortKey=i,y.sortDir="asc"),e()},onActionClick:(i,l)=>{var I,g,b,v;const p=m.fichesControle.find(d=>d.id===l);if(i==="edit"&&n(p),i==="valider"&&w({title:"Valider la fiche de contrôle",message:"En tant que Chef d'établissement, vous validez les informations de cette fiche (Lu et approuvé).",confirmLabel:"Valider (Lu et approuvé)",onConfirm:()=>{m.validerFiche(l),e()}}),i==="delete"&&w({title:"Supprimer la fiche de contrôle",message:"Voulez-vous vraiment supprimer cette fiche de contrôle ? Cette action est irréversible.",confirmLabel:"Supprimer",danger:!0,onConfirm:()=>{m.deleteFiche(l),e()}}),i==="print"){const d=m.ecoles.find(E=>E.id===p.ecoleId),u=m.chefs.find(E=>E.id===p.chefId),h=m.ordresMission.find(E=>E.id===p.ordreMissionId),Z=`
          <h2>Fiche de contrôle ${p.numero}</h2>
          <p class="text-secondary">Province Éducationnelle de Kinshasa / Mont-Amba</p>
          <hr />
          <h5>1. Généralités</h5>
          <p><strong>École :</strong> ${(d==null?void 0:d.denomination)||"—"}</p>
          <p><strong>Chef d'établissement :</strong> ${(u==null?void 0:u.nomComplet)||"—"}</p>
          <p><strong>Ordre de mission :</strong> ${(h==null?void 0:h.numero)||"—"}</p>
          <h5>2. Bâtiments & Infrastructures</h5>
          <p><strong>État général :</strong> ${((I=p.sectionBatiments)==null?void 0:I.etatGeneral)||"—"}</p>
          <p><strong>Nombre d'élèves :</strong> ${((g=p.sectionBatiments)==null?void 0:g.nombreEleves)||"—"}</p>
          <p><strong>Toilettes filles :</strong> ${((b=p.sectionBatiments)==null?void 0:b.toilettesFilles)||"—"}</p>
          <p><strong>Toilettes garçons :</strong> ${((v=p.sectionBatiments)==null?void 0:v.toilettesGarcons)||"—"}</p>
          <h5>3. Observations & Recommandations</h5>
          <p>${p.observations||"Aucune observation."}</p>
          <p><strong>Recommandation :</strong> ${p.recommandationPreliminaire||"—"}</p>
          <p><strong>Statut :</strong> ${re[p.statut]||p.statut}</p>
        `;de(`Fiche ${p.numero}`,Z)}}});const a=t.querySelector("#openCreateFicheBtn");a&&a.addEventListener("click",()=>n(null));const c=t.querySelector("#filterFicheStatut");c&&c.addEventListener("change",i=>{y.filterStatut=i.target.value,y.page=1,e()});const r=t.querySelector("#formOrdreMissionId");r&&r.addEventListener("change",i=>{const l=i.target.value;y.form.ordreMissionId=l;const p=m.ordresMission.find(I=>I.id===l);if(p){y.form.ecoleId=p.ecoleId;const I=m.chefs.find(g=>g.ecoleId===p.ecoleId);y.form.chefId=I?I.id:""}else y.form.ecoleId="",y.form.chefId="";e(),j("ficheModal")});const o=t.querySelector("#photoFileInput");o&&o.addEventListener("change",i=>{var I;const l=(I=i.target.files)==null?void 0:I[0];if(!l)return;const p=new FileReader;p.onload=g=>{y.form.photos.push({id:$t(),url:g.target.result,legende:l.name}),e(),j("ficheModal")},p.readAsDataURL(l)}),t.querySelectorAll("[data-remove-photo]").forEach(i=>{i.addEventListener("click",()=>{const l=parseInt(i.getAttribute("data-remove-photo"),10);y.form.photos.splice(l,1),e(),j("ficheModal")})});const s=t.querySelector("#ficheForm");s&&s.addEventListener("submit",i=>{var v,d,u,h,Z,E,N,A,f,M,G;i.preventDefault();const l=Array.from(t.querySelectorAll(".produit-check:checked")).map(C=>C.value),p=((v=t.querySelector("#formProduitsAutres"))==null?void 0:v.value.trim())||"",I=p?p.split(",").map(C=>C.trim()).filter(Boolean):[],g=Array.from(new Set([...l,...I])),b={id:y.form.id||void 0,numero:y.form.numero||void 0,ordreMissionId:y.form.ordreMissionId,ecoleId:y.form.ecoleId,chefId:y.form.chefId,statut:((d=t.querySelector("#formStatut"))==null?void 0:d.value)||y.form.statut,sectionBatiments:{nombreBatiments:Number((u=t.querySelector("#formNombreBatiments"))==null?void 0:u.value)||0,etatGeneral:((h=t.querySelector("#formEtatGeneral"))==null?void 0:h.value)||"Bon",toilettesFilles:((Z=t.querySelector("#formToilettesFilles"))==null?void 0:Z.value.trim())||"",toilettesGarcons:((E=t.querySelector("#formToilettesGarcons"))==null?void 0:E.value.trim())||"",nombreEleves:Number((N=t.querySelector("#formNombreEleves"))==null?void 0:N.value)||0},sectionImpact7:{montantPercu:((A=t.querySelector("#formMontantPercu"))==null?void 0:A.value.trim())||"",produitsNettoyage:g,quantite:((f=t.querySelector("#formQuantite"))==null?void 0:f.value.trim())||""},observations:((M=t.querySelector("#formObservations"))==null?void 0:M.value.trim())||"",recommandationPreliminaire:((G=t.querySelector("#formRecommandationPreliminaire"))==null?void 0:G.value)||oe[0],photos:y.form.photos};m.upsertFiche(b),X("ficheModal"),e()})}function Mt(t){return t?`Synthèse d'inspection portant sur ${t} fiche(s) de contrôle validée(s). Conformité partielle observée. À compléter par l'inspecteur.`:""}let S={q:"",page:1,sortKey:null,sortDir:"asc",filterStatut:"",syntheseDirty:!1,form:{id:null,numero:"",ficheIds:[],ecoleId:"",synthese:"",statut:"brouillon"}};function Re(){const t=m.rapports,e=m.fichesControle,n=m.ecoles,a=new Map(n.map(u=>[u.id,u]));new Map(e.map(u=>[u.id,u]));const c=e.filter(u=>u.statut==="validee"),r=t.filter(u=>!(S.filterStatut&&u.statut!==S.filterStatut)),o=[{key:"numero",header:"N° Rapport",sortable:!0},{key:"ecole",header:"École",render:u=>{var h;return((h=a.get(u.ecoleId))==null?void 0:h.denomination)||"—"}},{key:"fiches",header:"Fiches intégrées",render:u=>`${(u.ficheIds||[]).length} fiche(s)`},{key:"synthese",header:"Synthèse",render:u=>`
        <span class="text-truncate d-inline-block" style="max-width: 260px;" title="${u.synthese}">
          ${u.synthese}
        </span>
      `},{key:"statut",header:"Statut",sortable:!0,render:u=>V(ce,u.statut)},{key:"createdAt",header:"Créé le",sortable:!0,render:u=>_(u.createdAt)},{key:"actions",header:"Actions",render:u=>`
        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-sm btn-icon btn-outline-primary"
            title="${u.statut==="brouillon"?"Modifier":"Consulter"}"
            data-action="edit"
            data-id="${u.id}"
          >
            <i class="ti ${u.statut==="brouillon"?"ti-edit":"ti-eye"}"></i>
          </button>
          ${u.statut==="brouillon"?`<button type="button" class="btn btn-sm btn-primary" data-action="deposer" data-id="${u.id}">
                  <i class="ti ti-send me-1"></i> Déposer au Secrétariat
                </button>`:""}
          <button type="button" class="btn btn-sm btn-icon btn-outline-secondary" title="Exporter en PDF" data-action="print" data-id="${u.id}">
            <i class="ti ti-file-download"></i>
          </button>
          <button type="button" class="btn btn-sm btn-icon btn-outline-danger" title="Supprimer" data-action="delete" data-id="${u.id}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `}],s=`
    <select class="form-select" id="filterRapportStatut">
      <option value="">Tous les statuts</option>
      ${Object.entries(ce).map(([u,h])=>`<option value="${u}" ${S.filterStatut===u?"selected":""}>${h}</option>`).join("")}
    </select>
  `,i=Q({columns:o,rows:r,searchKeys:["numero","synthese",u=>{var h;return((h=a.get(u.ecoleId))==null?void 0:h.denomination)||""}],searchPlaceholder:"Rechercher un rapport, une école…",emptyMessage:"Aucun rapport d'inspection trouvé.",filtersHtml:s,q:S.q,page:S.page,sortKey:S.sortKey,sortDir:S.sortDir}),l=H({title:"Rapports d'inspection",subtitle:"Consolidation des fiches validées et dépôt au secrétariat",actionsHtml:`
      <button type="button" class="btn btn-primary" id="openCreateRapportBtn">
        <i class="ti ti-plus me-1"></i> Nouveau rapport
      </button>
    `}),p=!!S.form.id&&S.form.statut!=="brouillon",I=S.form.id?`Rapport ${S.form.numero||""}`:"Nouveau rapport d'inspection",g=a.get(S.form.ecoleId),b=`
    <form id="rapportForm">
      ${p?`<div class="alert alert-info">Ce rapport a été déposé : il n'est plus modifiable depuis cette page.</div>`:""}
      <fieldset ${p?"disabled":""} style="border: none; padding: 0; margin: 0;">
        <div class="mb-4">
          <label class="form-label">Fiches de contrôle validées <span class="text-danger">*</span></label>
          <div class="border rounded p-3" style="max-height: 260px; overflow-y: auto;">
            ${c.length===0?'<p class="text-secondary mb-0">Aucune fiche validée disponible.</p>':c.map(u=>{var h;return`
                <div class="form-check mb-2">
                  <input
                    class="form-check-input fiche-check"
                    type="checkbox"
                    id="fiche-${u.id}"
                    value="${u.id}"
                    ${S.form.ficheIds.includes(u.id)?"checked":""}
                    ${p&&!S.form.ficheIds.includes(u.id)?"disabled":""}
                  />
                  <label class="form-check-label" for="fiche-${u.id}">
                    ${u.numero} — ${((h=a.get(u.ecoleId))==null?void 0:h.denomination)||"—"} (validée le ${_(u.valideeLe)})
                  </label>
                </div>
              `}).join("")}
          </div>
          ${g?`<div class="form-text mt-2">École associée : <strong>${g.denomination}</strong></div>`:""}
        </div>

        <div class="mb-3">
          <label class="form-label">Synthèse</label>
          <textarea
            class="form-control"
            rows="5"
            id="formSynthese"
          >${S.form.synthese||""}</textarea>
          <div class="form-text">
            Cette synthèse est pré-remplie automatiquement et reste entièrement modifiable.
          </div>
        </div>
      </fieldset>
    </form>
  `,d=Y({id:"rapportModal",title:I,contentHtml:b,footerHtml:`
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
      ${p?"Fermer":"Annuler"}
    </button>
    ${p?"":'<button type="submit" form="rapportForm" class="btn btn-primary">Enregistrer</button>'}
  `,size:"lg"});return`
    <div>
      ${l}
      ${i}
      ${d}
    </div>
  `}function Be(t){if(!t)return;const e=()=>{t.innerHTML=Re(),Be(t)},n=(s=null)=>{s?(S.form={id:s.id,numero:s.numero||"",ficheIds:s.ficheIds?[...s.ficheIds]:[],ecoleId:s.ecoleId||"",synthese:s.synthese||"",statut:s.statut||"brouillon"},S.syntheseDirty=!0):(S.form={id:null,numero:"",ficheIds:[],ecoleId:"",synthese:"",statut:"brouillon"},S.syntheseDirty=!1),e(),j("rapportModal")};W(t,{onSearch:s=>{S.q=s,S.page=1,e()},onPageChange:s=>{S.page=s,e()},onSortChange:s=>{S.sortKey===s?S.sortDir=S.sortDir==="asc"?"desc":"asc":(S.sortKey=s,S.sortDir="asc"),e()},onActionClick:(s,i)=>{const l=m.rapports.find(p=>p.id===i);if(s==="edit"&&n(l),s==="deposer"&&w({title:"Déposer le rapport au Secrétariat",message:"Confirmez-vous le dépôt de ce rapport d'inspection au secrétariat pour traitement ?",confirmLabel:"Déposer",onConfirm:()=>{m.deposerRapport(i),e()}}),s==="delete"&&w({title:"Supprimer le rapport",message:"Cette action est irréversible. Confirmez-vous la suppression de ce rapport d'inspection ?",confirmLabel:"Supprimer",danger:!0,onConfirm:()=>{m.deleteRapport(i),e()}}),s==="print"){const p=m.ecoles.find(b=>b.id===l.ecoleId),I=(l.ficheIds||[]).map(b=>{const v=m.fichesControle.find(d=>d.id===b);return`<tr><td>${(v==null?void 0:v.numero)||b}</td><td>${(v==null?void 0:v.recommandationPreliminaire)||"—"}</td></tr>`}).join(""),g=`
          <h2>Rapport d'inspection ${l.numero}</h2>
          <p class="text-secondary">École : ${(p==null?void 0:p.denomination)||"—"}</p>
          <h4>Synthèse</h4>
          <p>${(l.synthese||"").replace(/\n/g,"<br/>")}</p>
          <h4>Fiches de contrôle intégrées</h4>
          <table class="table table-bordered">
            <thead><tr><th>N° Fiche</th><th>Recommandation préliminaire</th></tr></thead>
            <tbody>${I||'<tr><td colspan="2">Aucune fiche</td></tr>'}</tbody>
          </table>
          <table class="table table-bordered mt-4">
            <tbody>
              <tr><th style="width:220px">Statut</th><td>${ce[l.statut]||l.statut}</td></tr>
              <tr><th>Déposé le</th><td>${z(l.deposeLe)}</td></tr>
              <tr><th>Accusé de réception</th><td>${z(l.accuseReceptionLe)}</td></tr>
              <tr><th>Transmis le</th><td>${z(l.transmisLe)}</td></tr>
            </tbody>
          </table>
        `;de(`Rapport ${l.numero}`,g)}}});const a=t.querySelector("#openCreateRapportBtn");a&&a.addEventListener("click",()=>n(null));const c=t.querySelector("#filterRapportStatut");c&&c.addEventListener("change",s=>{S.filterStatut=s.target.value,S.page=1,e()}),t.querySelectorAll(".fiche-check").forEach(s=>{s.addEventListener("change",()=>{const i=Array.from(t.querySelectorAll(".fiche-check:checked")).map(l=>l.value);if(S.form.ficheIds=i,i.length){const l=m.fichesControle.find(p=>p.id===i[0]);S.form.ecoleId=(l==null?void 0:l.ecoleId)||""}else S.form.ecoleId="";S.syntheseDirty||(S.form.synthese=Mt(i.length)),e(),j("rapportModal")})});const r=t.querySelector("#formSynthese");r&&r.addEventListener("input",s=>{S.syntheseDirty=!0,S.form.synthese=s.target.value});const o=t.querySelector("#rapportForm");o&&o.addEventListener("submit",s=>{if(s.preventDefault(),S.form.ficheIds.length===0){m.pushToast("Veuillez sélectionner au moins une fiche de contrôle validée.","danger");return}const i={id:S.form.id||void 0,numero:S.form.numero.trim()||void 0,ficheIds:S.form.ficheIds,ecoleId:S.form.ecoleId,synthese:t.querySelector("#formSynthese").value.trim(),statut:S.form.statut};m.upsertRapport(i),X("rapportModal"),e()})}let O={q:"",page:1,sortKey:null,sortDir:"asc",statutFiltre:""};function Ke(){const t=m.rapports,e=m.ecoles,n=i=>{var l;return((l=e.find(p=>p.id===i))==null?void 0:l.denomination)||"—"};let a=t.filter(i=>i.statut==="depose"||i.statut==="recu");O.statutFiltre&&(a=a.filter(i=>i.statut===O.statutFiltre));const c=[{key:"numero",header:"N° Rapport",sortable:!0},{key:"ecole",header:"École",sortKey:"ecoleId",render:i=>n(i.ecoleId)},{key:"deposeLe",header:"Déposé le",sortable:!0,render:i=>z(i.deposeLe)},{key:"accuseReceptionLe",header:"Accusé délivré le",render:i=>z(i.accuseReceptionLe)},{key:"statut",header:"Statut",render:i=>V(ce,i.statut)},{key:"actions",header:"Actions",render:i=>`
        <div class="d-flex gap-2">
          ${i.statut==="depose"?`<button type="button" class="btn btn-sm btn-outline-primary" data-action="accuse" data-id="${i.id}">
                  <i class="ti ti-mail-check me-1"></i> Délivrer l'accusé
                </button>`:""}
          ${i.statut==="recu"?`<button type="button" class="btn btn-sm btn-outline-success" data-action="transmission" data-id="${i.id}">
                  <i class="ti ti-send me-1"></i> Transmettre au Directeur Provincial
                </button>`:""}
        </div>
      `}],r=`
    <select class="form-select" id="filterStatutFiltre">
      <option value="">Tous les statuts</option>
      <option value="depose" ${O.statutFiltre==="depose"?"selected":""}>Déposé (en attente d'accusé)</option>
      <option value="recu" ${O.statutFiltre==="recu"?"selected":""}>Reçu (en attente de transmission)</option>
    </select>
  `,o=Q({columns:c,rows:a,searchKeys:["numero",i=>n(i.ecoleId)],searchPlaceholder:"Rechercher un rapport ou une école…",emptyMessage:"Aucun rapport en attente d'accusé ou de transmission.",filtersHtml:r,q:O.q,page:O.page,sortKey:O.sortKey,sortDir:O.sortDir});return`
    <div>
      ${H({title:"Accusés de réception",subtitle:"Délivrance des accusés de réception et transmission des rapports au Directeur Provincial."})}
      ${o}
    </div>
  `}function Oe(t){if(!t)return;const e=()=>{t.innerHTML=Ke(),Oe(t)};W(t,{onSearch:a=>{O.q=a,O.page=1,e()},onPageChange:a=>{O.page=a,e()},onSortChange:a=>{O.sortKey===a?O.sortDir=O.sortDir==="asc"?"desc":"asc":(O.sortKey=a,O.sortDir="asc"),e()},onActionClick:(a,c)=>{const r=m.rapports.find(o=>o.id===c);a==="accuse"&&w({title:"Délivrer l'accusé de réception",message:`Confirmez-vous la délivrance de l'accusé de réception pour le rapport ${r==null?void 0:r.numero} ?`,confirmLabel:"Confirmer",onConfirm:()=>{m.delivrerAccuse(c),e()}}),a==="transmission"&&w({title:"Transmettre le rapport",message:`Confirmez-vous la transmission du rapport ${r==null?void 0:r.numero} au Directeur Provincial ?`,confirmLabel:"Confirmer",onConfirm:()=>{m.transmettreRapport(c),e()}})}});const n=t.querySelector("#filterStatutFiltre");n&&n.addEventListener("change",a=>{O.statutFiltre=a.target.value,O.page=1,e()})}let $={q:"",page:1,sortKey:null,sortDir:"asc",filterType:"",filterExec:"",editingId:null,form:{ecoleId:"",rapportId:"",type:"maintien",delaiExecution:"7 jours",commentaire:"",statutExecution:"en_cours"}};function je(){const t=m.rapports,e=m.ecoles,n=m.decisions,a=d=>{var u;return((u=e.find(h=>h.id===d))==null?void 0:u.denomination)||"—"},c=d=>{var u;return((u=t.find(h=>h.id===d))==null?void 0:u.numero)||"—"},r=t.filter(d=>d.statut==="transmis"&&!n.some(u=>u.rapportId===d.id)),o=n.filter(d=>(!$.filterType||d.type===$.filterType)&&(!$.filterExec||d.statutExecution===$.filterExec)),s=[{key:"numero",header:"N° Décision",sortable:!0},{key:"ecole",header:"École",sortKey:"ecoleId",render:d=>a(d.ecoleId)},{key:"rapport",header:"Rapport",render:d=>c(d.rapportId)},{key:"type",header:"Type",sortable:!0,render:d=>V(ne,d.type)},{key:"delaiExecution",header:"Délai"},{key:"statutExecution",header:"Statut d'exécution",sortable:!0,render:d=>V(ue,d.statutExecution)},{key:"decideLe",header:"Décidé le",sortable:!0,render:d=>_(d.decideLe)},{key:"actions",header:"Actions",render:d=>`
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${d.id}" aria-label="Modifier">
            <i class="ti ti-pencil"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${d.id}" aria-label="Supprimer">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `}],i=`
    <div class="row g-2">
      <div class="col-md-6">
        <select class="form-select" id="filterTypeSelect">
          <option value="">Tous les types</option>
          ${Object.entries(ne).map(([d,u])=>`<option value="${d}" ${$.filterType===d?"selected":""}>${u}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-6">
        <select class="form-select" id="filterExecSelect">
          <option value="">Tous les statuts d'exécution</option>
          ${Object.entries(ue).map(([d,u])=>`<option value="${d}" ${$.filterExec===d?"selected":""}>${u}</option>`).join("")}
        </select>
      </div>
    </div>
  `,l=Q({columns:s,rows:o,searchKeys:["numero",d=>a(d.ecoleId)],searchPlaceholder:"Rechercher une décision ou une école…",emptyMessage:"Aucune décision enregistrée.",filtersHtml:i,q:$.q,page:$.page,sortKey:$.sortKey,sortDir:$.sortDir}),p=H({title:"Décisions",subtitle:"Rapports transmis en attente de décision et suivi des décisions prises.",actionsHtml:`
      <button type="button" class="btn btn-primary" id="openNewDecisionBtn">
        <i class="ti ti-plus me-1"></i> Nouvelle décision
      </button>
    `}),I=$.editingId?"Modifier la décision":"Nouvelle décision",g=`
    <form id="decisionForm">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Rapport concerné</label>
          <select
            class="form-select"
            id="formRapportId"
            required
            ${$.editingId?"disabled":""}
          >
            <option value="">Sélectionner un rapport…</option>
            ${t.map(d=>`<option value="${d.id}" ${$.form.rapportId===d.id?"selected":""}>${d.numero} — ${a(d.ecoleId)}</option>`).join("")}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">École</label>
          <input type="text" class="form-control" id="formEcoleName" value="${a($.form.ecoleId)}" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label">Type de décision</label>
          <select class="form-select" id="formType" required>
            ${Object.entries(ne).map(([d,u])=>`<option value="${d}" ${$.form.type===d?"selected":""}>${u}</option>`).join("")}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Délai d'exécution</label>
          <input
            type="text"
            class="form-control"
            id="formDelaiExecution"
            placeholder="Ex. 14 jours"
            value="${$.form.delaiExecution||""}"
            required
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Statut d'exécution</label>
          <select class="form-select" id="formStatutExecution">
            ${Object.entries(ue).map(([d,u])=>`<option value="${d}" ${$.form.statutExecution===d?"selected":""}>${u}</option>`).join("")}
          </select>
        </div>
        <div class="col-12">
          <label class="form-label">Commentaire</label>
          <textarea class="form-control" rows="3" id="formCommentaire">${$.form.commentaire||""}</textarea>
        </div>
      </div>
    </form>
  `,v=Y({id:"decisionModal",title:I,contentHtml:g,footerHtml:`
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
    <button type="submit" form="decisionForm" class="btn btn-primary">Enregistrer</button>
  `,size:"lg"});return`
    <div>
      ${p}

      <div class="card card-lg mb-6">
        <div class="card-header border-bottom-0">
          <h5 class="mb-0">Rapports en attente de décision</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>N° Rapport</th>
                  <th>École</th>
                  <th>Transmis le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${r.length===0?`
                  <tr>
                    <td colSpan="4" class="text-center text-secondary py-5">
                      Aucun rapport en attente de décision.
                    </td>
                  </tr>
                `:r.map(d=>`
                    <tr>
                      <td>${d.numero}</td>
                      <td>${a(d.ecoleId)}</td>
                      <td>${z(d.transmisLe)}</td>
                      <td>
                        <button type="button" class="btn btn-sm btn-primary" data-open-from-rapport="${d.id}">
                          <i class="ti ti-gavel me-1"></i> Prendre une décision
                        </button>
                      </td>
                    </tr>
                  `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h5 class="mb-3">Décisions enregistrées</h5>
      ${l}
      ${v}
    </div>
  `}function _e(t){if(!t)return;const e=()=>{t.innerHTML=je(),_e(t)},n=(o=null,s=null)=>{if($.editingId=o,s)$.form={...s};else if(o){const i=m.decisions.find(l=>l.id===o);i&&($.form={ecoleId:i.ecoleId,rapportId:i.rapportId,type:i.type,delaiExecution:i.delaiExecution,commentaire:i.commentaire||"",statutExecution:i.statutExecution})}else $.form={ecoleId:"",rapportId:"",type:"maintien",delaiExecution:"7 jours",commentaire:"",statutExecution:"en_cours"};e(),j("decisionModal")};W(t,{onSearch:o=>{$.q=o,$.page=1,e()},onPageChange:o=>{$.page=o,e()},onSortChange:o=>{$.sortKey===o?$.sortDir=$.sortDir==="asc"?"desc":"asc":($.sortKey=o,$.sortDir="asc"),e()},onActionClick:(o,s)=>{if(o==="edit"&&n(s),o==="delete"){const i=m.decisions.find(l=>l.id===s);w({title:"Supprimer la décision",message:`Confirmez-vous la suppression de la décision ${i==null?void 0:i.numero} ? Le statut de l'école ne sera pas restauré automatiquement.`,confirmLabel:"Supprimer",danger:!0,onConfirm:()=>{m.deleteDecision(s),e()}})}}});const a=t.querySelector("#openNewDecisionBtn");a&&a.addEventListener("click",()=>n(null)),t.querySelectorAll("[data-open-from-rapport]").forEach(o=>{o.addEventListener("click",()=>{const s=o.getAttribute("data-open-from-rapport"),i=m.rapports.find(l=>l.id===s);i&&n(null,{ecoleId:i.ecoleId,rapportId:i.id,type:"maintien",delaiExecution:"7 jours",commentaire:"",statutExecution:"en_cours"})})}),["filterTypeSelect","filterExecSelect"].forEach(o=>{const s=t.querySelector(`#${o}`);s&&s.addEventListener("change",i=>{o==="filterTypeSelect"&&($.filterType=i.target.value),o==="filterExecSelect"&&($.filterExec=i.target.value),$.page=1,e()})});const c=t.querySelector("#formRapportId");c&&c.addEventListener("change",o=>{var p;const s=o.target.value,i=m.rapports.find(I=>I.id===s);$.form.rapportId=s,$.form.ecoleId=(i==null?void 0:i.ecoleId)||"";const l=t.querySelector("#formEcoleName");l&&(l.value=((p=m.ecoles.find(I=>I.id===$.form.ecoleId))==null?void 0:p.denomination)||"—")});const r=t.querySelector("#decisionForm");r&&r.addEventListener("submit",o=>{if(o.preventDefault(),!$.form.ecoleId||!$.form.rapportId)return;const s={id:$.editingId||void 0,ecoleId:$.form.ecoleId,rapportId:$.form.rapportId,type:t.querySelector("#formType").value,delaiExecution:t.querySelector("#formDelaiExecution").value.trim(),statutExecution:t.querySelector("#formStatutExecution").value,commentaire:t.querySelector("#formCommentaire").value.trim()};m.upsertDecision(s),X("decisionModal"),e()})}const Lt=["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],he=["Bon","Moyen","Dégradé","Critique"];let L={dateFrom:"",dateTo:"",commune:"",regime:"",statutEcole:""},ee=[];function we(){const t=m.ecoles,e=m.fichesControle,n=m.decisions,a=m.communes,c=m.regimes,r=u=>{if(!u)return!0;const h=new Date(u);return!(L.dateFrom&&h<new Date(L.dateFrom)||L.dateTo&&h>new Date(`${L.dateTo}T23:59:59`))},o=t.filter(u=>{var h;return(!L.commune||((h=u.adresse)==null?void 0:h.commune)===L.commune)&&(!L.regime||u.regime===L.regime)&&(!L.statutEcole||u.statut===L.statutEcole)}),s=new Set(o.map(u=>u.id)),i=e.filter(u=>s.has(u.ecoleId)&&r(u.createdAt)),l=n.filter(u=>s.has(u.ecoleId)&&r(u.decideLe)),p={Bon:0,Moyen:0,Dégradé:0,Critique:0};i.forEach(u=>{var Z;const h=(Z=u.sectionBatiments)==null?void 0:Z.etatGeneral;p[h]!==void 0&&(p[h]+=1)});const I=he.map(u=>p[u]),g=i.length,b=I[0]+I[1],v=g?Math.round(b/g*100):0;return`
    <div>
      ${H({title:"Statistiques",subtitle:"Indicateurs de conformité, de contrôle et d'utilisation des ressources des écoles.",actionsHtml:`
      <div class="d-flex gap-2 justify-content-md-end">
        <button type="button" class="btn btn-outline-secondary" id="exportExcelBtn">
          <i class="ti ti-file-spreadsheet me-1"></i> Excel
        </button>
        <button type="button" class="btn btn-outline-secondary" id="exportPdfBtn">
          <i class="ti ti-file-type-pdf me-1"></i> PDF
        </button>
      </div>
    `})}

      <div class="card card-lg mb-6">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-2">
              <label class="form-label">Du</label>
              <input
                type="date"
                class="form-control"
                id="filterDateFrom"
                value="${L.dateFrom}"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">Au</label>
              <input
                type="date"
                class="form-control"
                id="filterDateTo"
                value="${L.dateTo}"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Commune</label>
              <select class="form-select" id="filterCommuneStat">
                <option value="">Toutes les communes</option>
                ${a.map(u=>`<option value="${u.nom}" ${L.commune===u.nom?"selected":""}>${u.nom}</option>`).join("")}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Régime</label>
              <select class="form-select" id="filterRegimeStat">
                <option value="">Tous</option>
                ${c.map(u=>`<option value="${u.nom}" ${L.regime===u.nom?"selected":""}>${u.nom}</option>`).join("")}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Statut école</label>
              <select class="form-select" id="filterStatutEcoleStat">
                <option value="">Tous</option>
                ${Object.entries(ie).map(([u,h])=>`<option value="${u}" ${L.statutEcole===u?"selected":""}>${h}</option>`).join("")}
              </select>
            </div>
            <div class="col-md-1">
              <button
                type="button"
                class="btn btn-outline-secondary w-100"
                id="resetStatFiltersBtn"
                title="Réinitialiser"
              >
                <i class="ti ti-refresh"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-6">
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body">
              <p class="text-secondary small mb-1">Écoles concernées</p>
              <h3 class="mb-0">${o.length}</h3>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body">
              <p class="text-secondary small mb-1">Fiches de contrôle</p>
              <h3 class="mb-0">${i.length}</h3>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body">
              <p class="text-secondary small mb-1">Taux de conformité</p>
              <h3 class="mb-0">${v}%</h3>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body">
              <p class="text-secondary small mb-1">Décisions prises</p>
              <h3 class="mb-0">${l.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-6">
        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Taux de conformité des établissements</h5>
              <div id="statChartConformite"></div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Répartition des décisions</h5>
              <div id="statChartDecisions"></div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Taux d'utilisation des 7 %</h5>
              <div id="statChart7"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12">
          <div class="card card-lg">
            <div class="card-body">
              <h5 class="mb-4">Évolution des contrôles réalisés</h5>
              <div id="statChartEvolution"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function Ge(t){if(!t)return;const e=()=>{t.innerHTML=we(),Ge(t)};ee.forEach(b=>{try{b.destroy()}catch{}}),ee=[];const n=b=>{if(!b)return!0;const v=new Date(b);return!(L.dateFrom&&v<new Date(L.dateFrom)||L.dateTo&&v>new Date(`${L.dateTo}T23:59:59`))},a=m.ecoles,c=m.fichesControle,r=m.decisions,o=a.filter(b=>{var v;return(!L.commune||((v=b.adresse)==null?void 0:v.commune)===L.commune)&&(!L.regime||b.regime===L.regime)&&(!L.statutEcole||b.statut===L.statutEcole)}),s=new Set(o.map(b=>b.id)),i=c.filter(b=>s.has(b.ecoleId)&&n(b.createdAt)),l=r.filter(b=>s.has(b.ecoleId)&&n(b.decideLe));if(typeof window.ApexCharts<"u"){const b={Bon:0,Moyen:0,Dégradé:0,Critique:0};i.forEach(P=>{var U;const R=(U=P.sectionBatiments)==null?void 0:U.etatGeneral;b[R]!==void 0&&(b[R]+=1)});const v=he.map(P=>b[P]),d=t.querySelector("#statChartConformite");if(d){const P=new window.ApexCharts(d,{chart:{type:"donut",height:300},labels:he,colors:["#20c997","#0d6efd","#fd7e14","#dc3545"],legend:{position:"bottom"},series:v});P.render(),ee.push(P)}const u={};l.forEach(P=>{u[P.type]=(u[P.type]||0)+1});const h=Object.entries(u).map(([P,R])=>({label:ne[P]||P,count:R})),Z=t.querySelector("#statChartDecisions");if(Z)if(h.length===0)Z.innerHTML='<p class="text-secondary mb-0">Aucune décision sur la période sélectionnée.</p>';else{const P=new window.ApexCharts(Z,{chart:{type:"donut",height:300},labels:h.map(R=>R.label),colors:["#0d6efd","#ffc107","#fd7e14","#dc3545"],legend:{position:"bottom"},series:h.map(R=>R.count)});P.render(),ee.push(P)}const E=i.filter(P=>{var R;return(((R=P.sectionImpact7)==null?void 0:R.montantPercu)||0)>0}),N=E.filter(P=>{var R,U;return(((U=(R=P.sectionImpact7)==null?void 0:R.produitsNettoyage)==null?void 0:U.length)||0)>0}),A=E.length?Math.round(N.length/E.length*100):0,f=t.querySelector("#statChart7");if(f){const P=new window.ApexCharts(f,{chart:{type:"radialBar",height:300},labels:["Produits d'hygiène achetés"],colors:["#0d6efd"],plotOptions:{radialBar:{hollow:{size:"60%"},dataLabels:{value:{formatter:R=>`${R}%`}}}},series:[A]});P.render(),ee.push(P)}const M={};i.forEach(P=>{const R=new Date(P.createdAt),U=`${R.getFullYear()}-${String(R.getMonth()+1).padStart(2,"0")}`;M[U]=(M[U]||0)+1});const G=Object.entries(M).sort(([P],[R])=>P.localeCompare(R)).map(([P,R])=>{const[U,ze]=P.split("-");return{label:`${Lt[Number(ze)-1]} ${U.slice(2)}`,count:R}}),C=t.querySelector("#statChartEvolution");if(C)if(G.length===0)C.innerHTML='<p class="text-secondary mb-0">Aucune fiche de contrôle sur la période sélectionnée.</p>';else{const P=new window.ApexCharts(C,{chart:{type:"bar",height:320,toolbar:{show:!1}},plotOptions:{bar:{columnWidth:"45%",borderRadius:4}},xaxis:{categories:G.map(R=>R.label)},colors:["#0d6efd"],series:[{name:"Fiches de contrôle",data:G.map(R=>R.count)}]});P.render(),ee.push(P)}}["filterDateFrom","filterDateTo","filterCommuneStat","filterRegimeStat","filterStatutEcoleStat"].forEach(b=>{const v=t.querySelector(`#${b}`);v&&v.addEventListener("change",d=>{b==="filterDateFrom"&&(L.dateFrom=d.target.value),b==="filterDateTo"&&(L.dateTo=d.target.value),b==="filterCommuneStat"&&(L.commune=d.target.value),b==="filterRegimeStat"&&(L.regime=d.target.value),b==="filterStatutEcoleStat"&&(L.statutEcole=d.target.value),e()})});const p=t.querySelector("#resetStatFiltersBtn");p&&p.addEventListener("click",()=>{L={dateFrom:"",dateTo:"",commune:"",regime:"",statutEcole:""},e()});const I=t.querySelector("#exportPdfBtn");I&&I.addEventListener("click",()=>{const b=i.length,v={Bon:0,Moyen:0,Dégradé:0,Critique:0};i.forEach(Z=>{var N;const E=(N=Z.sectionBatiments)==null?void 0:N.etatGeneral;v[E]!==void 0&&(v[E]+=1)});const d=v.Bon+v.Moyen,u=b?Math.round(d/b*100):0,h=`
        <h2>Rapport statistique — Inspect-San</h2>
        <p>Période : ${L.dateFrom?_(L.dateFrom):"début"} — ${L.dateTo?_(L.dateTo):"aujourd'hui"}</p>
        <p>Filtres : Commune ${L.commune||"toutes"}, Régime ${L.regime||"tous"}, Statut école ${L.statutEcole?ie[L.statutEcole]:"tous"}</p>
        <table border="1" cellpadding="6" style="border-collapse:collapse;width:100%">
          <tr><th>Indicateur</th><th>Valeur</th></tr>
          <tr><td>Écoles concernées</td><td>${o.length}</td></tr>
          <tr><td>Fiches de contrôle</td><td>${i.length}</td></tr>
          <tr><td>Taux de conformité</td><td>${u}%</td></tr>
          <tr><td>Décisions prises</td><td>${l.length}</td></tr>
        </table>
      `;de("Statistiques Inspect-San",h)});const g=t.querySelector("#exportExcelBtn");g&&g.addEventListener("click",()=>{const b=i.length,v={Bon:0,Moyen:0,Dégradé:0,Critique:0};i.forEach(Z=>{var N;const E=(N=Z.sectionBatiments)==null?void 0:N.etatGeneral;v[E]!==void 0&&(v[E]+=1)});const d=v.Bon+v.Moyen,u=b?Math.round(d/b*100):0,h=["Indicateur;Valeur",`Ecoles concernees;${o.length}`,`Fiches de controle;${i.length}`,`Taux de conformite (%);${u}`,`Decisions prises;${l.length}`];dt("statistiques_inspect-san.csv",h.join(`
`),"text/csv;charset=utf-8;")})}const Nt=[{key:"communes",label:"Communes"},{key:"regimes",label:"Régimes"},{key:"typesDecision",label:"Types de décision"}];let K={activeTab:"communes",editing:null,form:{nom:"",code:"",libelle:"",actif:!0}};function ke(){const t=m.communes,e=m.regimes,n=m.typesDecision,c={communes:t,regimes:e,typesDecision:n}[K.activeTab]||[],r=K.activeTab==="typesDecision",o=v=>r?v.libelle:v.nom,s=H({title:"Paramètres",subtitle:"Gestion des référentiels : communes, régimes et types de décision.",actionsHtml:`
      <button type="button" class="btn btn-primary" id="openNewRefBtn">
        <i class="ti ti-plus me-1"></i> Ajouter
      </button>
    `}),i=`
    <ul class="nav nav-tabs mb-4">
      ${Nt.map(v=>`
        <li class="nav-item">
          <button
            type="button"
            class="nav-link ${K.activeTab===v.key?"active":""}"
            data-tab="${v.key}"
          >
            ${v.label}
          </button>
        </li>
      `).join("")}
    </ul>
  `,l=c.length===0?`<tr><td colSpan="${r?4:3}" class="text-center text-secondary py-5">Aucun enregistrement.</td></tr>`:c.map(v=>`
        <tr data-id="${v.id}">
          ${r?`<td>${v.code}</td>`:""}
          <td>${o(v)}</td>
          <td>
            <span class="badge bg-${v.actif?"success":"secondary"}-subtle text-${v.actif?"success":"secondary"}-emphasis">
              ${v.actif?"Actif":"Inactif"}
            </span>
          </td>
          <td>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${v.id}" aria-label="Modifier">
                <i class="ti ti-pencil"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${v.id}" aria-label="Supprimer">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join(""),p=K.editing?"Modifier la référence":"Ajouter une référence",I=`
    <form id="refForm">
      ${r?`
        <div class="mb-3">
          <label class="form-label">Code</label>
          <input
            type="text"
            class="form-control"
            id="formRefCode"
            value="${K.form.code||""}"
            placeholder="ex. maintien"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Libellé</label>
          <input
            type="text"
            class="form-control"
            id="formRefLibelle"
            value="${K.form.libelle||""}"
            required
          />
        </div>
      `:`
        <div class="mb-3">
          <label class="form-label">Nom</label>
          <input
            type="text"
            class="form-control"
            id="formRefNom"
            value="${K.form.nom||""}"
            required
          />
        </div>
      `}
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="actifSwitch"
          ${K.form.actif?"checked":""}
        />
        <label class="form-check-label" for="actifSwitch">
          Actif
        </label>
      </div>
    </form>
  `,b=Y({id:"refModal",title:p,contentHtml:I,footerHtml:`
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
    <button type="submit" form="refForm" class="btn btn-primary">Enregistrer</button>
  `,size:"md"});return`
    <div>
      ${s}
      ${i}
      <div class="card card-lg">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  ${r?"<th>Code</th>":""}
                  <th>${r?"Libellé":"Nom"}</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${l}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ${b}
    </div>
  `}function He(t){if(!t)return;const e=()=>{t.innerHTML=ke(),He(t)},n=(r=null)=>{K.editing=r;const o=K.activeTab==="typesDecision";r?K.form=o?{code:r.code,libelle:r.libelle,actif:r.actif}:{nom:r.nom,actif:r.actif}:K.form=o?{code:"",libelle:"",actif:!0}:{nom:"",actif:!0},e(),j("refModal")};t.querySelectorAll("[data-tab]").forEach(r=>{r.addEventListener("click",()=>{K.activeTab=r.getAttribute("data-tab"),e()})});const a=t.querySelector("#openNewRefBtn");a&&a.addEventListener("click",()=>n(null)),t.querySelectorAll('[data-action="edit"]').forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-id"),i=(m[K.activeTab]||[]).find(l=>l.id===o);n(i)})}),t.querySelectorAll('[data-action="delete"]').forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-id"),i=(m[K.activeTab]||[]).find(I=>I.id===o),l=K.activeTab==="typesDecision",p=i?l?i.libelle:i.nom:"";w({title:"Supprimer la référence",message:`Confirmez-vous la suppression de « ${p} » ?`,confirmLabel:"Supprimer",danger:!0,onConfirm:()=>{m.deleteRef(K.activeTab,o),e()}})})});const c=t.querySelector("#refForm");c&&c.addEventListener("submit",r=>{r.preventDefault();const o=K.activeTab==="typesDecision",s=t.querySelector("#actifSwitch").checked;let i={};o?i={code:t.querySelector("#formRefCode").value.trim(),libelle:t.querySelector("#formRefLibelle").value.trim(),actif:s}:i={nom:t.querySelector("#formRefNom").value.trim(),actif:s},K.editing&&(i.id=K.editing.id),m.upsertRef(K.activeTab,i),X("refModal"),e()})}let q={q:"",page:1,sortKey:null,sortDir:"asc",utilisateurId:"",module:"",dateFrom:"",dateTo:""};function Je(){const t=m.journalActivite,e=m.utilisateurs,n=l=>{var p;return((p=e.find(I=>I.id===l))==null?void 0:p.nom)||"Système"},a=Array.from(new Set(t.map(l=>l.module))).sort((l,p)=>l.localeCompare(p,"fr")),c=[...t].filter(l=>!q.utilisateurId||l.utilisateurId===q.utilisateurId).filter(l=>!q.module||l.module===q.module).filter(l=>{if(!q.dateFrom&&!q.dateTo)return!0;const p=new Date(l.createdAt);return!(q.dateFrom&&p<new Date(q.dateFrom)||q.dateTo&&p>new Date(`${q.dateTo}T23:59:59`))}).sort((l,p)=>new Date(p.createdAt)-new Date(l.createdAt)).map(l=>({...l,userName:n(l.utilisateurId)})),r=[{key:"createdAt",header:"Date et heure",sortable:!0,render:l=>z(l.createdAt)},{key:"userName",header:"Utilisateur",sortable:!0},{key:"module",header:"Module",sortable:!0},{key:"action",header:"Action",sortable:!0,render:l=>`<span class="text-capitalize">${l.action}</span>`},{key:"detail",header:"Détail"}],o=`
    <div class="row g-2">
      <div class="col-md-3">
        <select class="form-select" id="filterUtilisateur">
          <option value="">Tous les utilisateurs</option>
          ${e.map(l=>`<option value="${l.id}" ${q.utilisateurId===l.id?"selected":""}>${l.nom}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-3">
        <select class="form-select" id="filterModule">
          <option value="">Tous les modules</option>
          ${a.map(l=>`<option value="${l}" ${q.module===l?"selected":""}>${l}</option>`).join("")}
        </select>
      </div>
      <div class="col-md-3">
        <input
          type="date"
          class="form-control"
          id="filterDateFromJ"
          value="${q.dateFrom}"
          title="Du"
        />
      </div>
      <div class="col-md-3">
        <input
          type="date"
          class="form-control"
          id="filterDateToJ"
          value="${q.dateTo}"
          title="Au"
        />
      </div>
    </div>
  `,s=Q({columns:r,rows:c,searchKeys:["detail","module","action","userName"],searchPlaceholder:"Rechercher dans le journal…",emptyMessage:"Aucune activité ne correspond aux filtres sélectionnés.",filtersHtml:o,q:q.q,page:q.page,sortKey:q.sortKey,sortDir:q.sortDir});return`
    <div>
      ${H({title:"Journal d'activité",subtitle:"Historique consultable en lecture seule de toutes les actions effectuées dans l'application."})}
      ${s}
    </div>
  `}function Ue(t){if(!t)return;const e=()=>{t.innerHTML=Je(),Ue(t)};W(t,{onSearch:n=>{q.q=n,q.page=1,e()},onPageChange:n=>{q.page=n,e()},onSortChange:n=>{q.sortKey===n?q.sortDir=q.sortDir==="asc"?"desc":"asc":(q.sortKey=n,q.sortDir="asc"),e()}}),["filterUtilisateur","filterModule","filterDateFromJ","filterDateToJ"].forEach(n=>{const a=t.querySelector(`#${n}`);a&&a.addEventListener("change",c=>{n==="filterUtilisateur"&&(q.utilisateurId=c.target.value),n==="filterModule"&&(q.module=c.target.value),n==="filterDateFromJ"&&(q.dateFrom=c.target.value),n==="filterDateToJ"&&(q.dateTo=c.target.value),q.page=1,e()})})}const Ae={"#/connexion":{render:At,init:Tt,isPublic:!0},"#/":{render:Et,init:Pt,pageKey:"dashboard"},"#/ecoles":{render:Ce,init:De,pageKey:"ecoles"},"#/chefs":{render:Se,init:$e,pageKey:"chefs"},"#/utilisateurs":{render:Me,init:Le,pageKey:"utilisateurs"},"#/ordres-mission":{render:Ne,init:xe,pageKey:"ordres"},"#/fiches-controle":{render:Fe,init:qe,pageKey:"fiches"},"#/rapports":{render:Re,init:Be,pageKey:"rapports"},"#/accuses":{render:Ke,init:Oe,pageKey:"accuses"},"#/decisions":{render:je,init:_e,pageKey:"decisions"},"#/statistiques":{render:we,init:Ge,pageKey:"statistiques"},"#/parametres":{render:ke,init:He,pageKey:"parametres"},"#/journal":{render:Je,init:Ue,pageKey:"journal"}};class xt{constructor(e){this.appElement=e}init(){window.addEventListener("hashchange",()=>this.handleRoute()),m.subscribe(()=>this.handleRoute()),this.handleRoute()}handleRoute(){var c;const n=(window.location.hash||"#/").split("?")[0],a=Ae[n]||Ae["#/"];if(!m.currentUser&&!a.isPublic){window.location.hash="#/connexion";return}if(m.currentUser&&a.isPublic){window.location.hash="#/";return}if(a.pageKey&&a.pageKey!=="dashboard"){const r=(c=m.currentUser)==null?void 0:c.role;if(!Te(r,a.pageKey)){window.location.hash="#/";return}}if(a.isPublic)this.appElement.innerHTML=`
        ${a.render()}
        ${ge()}
      `,a.init(this.appElement),Ie(this.appElement);else{this.appElement.innerHTML=`
        <div>
          ${ft(n)}
          <div id="content" class="position-relative h-100">
            ${gt()}
            <div className="custom-container py-6 px-4 px-lg-6" id="pageContainer">
              ${a.render()}
            </div>
          </div>
          ${ge()}
        </div>
      `;const r=this.appElement.querySelector("#pageContainer");vt(this.appElement),It(this.appElement),Ie(this.appElement),r&&a.init&&a.init(r)}}}document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("app");t&&new xt(t).init()});

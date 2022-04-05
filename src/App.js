import logo from './logo.svg';
import './App.css';
import SideMenuPatient from './Components/PatientDashboard/Menu';
import { BrowserRouter as Router, Routes , Route} from 'react-router-dom';
import DisplayRecords from './Components/PatientDashboard/EHealthRecords';

const patientId=456;

function App() {
  return (
    <div className="App" style={{display:'flex'}}>
      <Router>
      <SideMenuPatient patientId={patientId}/>
      <Routes>
        <Route path={"Pat_"+patientId+"/E-Health-Records"} element = {<DisplayRecords patientId={patientId}/>} />
      </Routes>
      </Router>
      
    </div>
  );
}

export default App;

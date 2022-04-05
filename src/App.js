import logo from './logo.svg';
import './App.css';
import SideMenuPatient from './Components/PatientDashboard/Menu';
import { BrowserRouter as Router, Routes , Route} from 'react-router-dom';
import DisplayRecords from './Components/PatientDashboard/EHealthRecords';
import PatientProfile from './Components/PatientDashboard/Profile';

const patientId=1234;

function App() {
  return (
    <div className="App" style={{display:'flex'}}>
      <Router>
      <SideMenuPatient patientId={patientId}/>
      <Routes>
        <Route path={patientId+"/E-Health-Records"} element = {<DisplayRecords patientId={patientId}/>} />
        <Route path={patientId+"/Profile"} element= {<PatientProfile/>} />
      </Routes>
      </Router>
      
    </div>
  );
}

export default App;

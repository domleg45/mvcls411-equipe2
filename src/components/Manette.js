import "./manette.css";

function Manette(){
    return(
        <div class="container">
        <div class="row justify-content-center align-items-center vh-100">
          <div class="controller bg-black p-5" id="controller"> 
            <div class="d-pad d-grid gap-3" id="dpad">
              <button type="button" class="btn btn-light up"><i class="bi bi-caret-up-fill"></i></button>
              <button type="button" class="btn btn-light left"><i class="bi bi-caret-left-fill"></i></button>
              <button type="button" class="btn btn-light middle"><i class="bi bi-check-circle-fill"></i></button>
              <button type="button" class="btn btn-light right"><i class="bi bi-caret-right-fill"></i></button>
              <button type="button" class="btn btn-light down"><i class="bi bi-caret-down-fill"></i></button>
            </div>
            <div class="menu mt-5">
              <div class="volume d-flex justify-content-center gap-3" >
                <button class="btn btn-light fs-4"><i class="bi bi-plus"></i></button>
                <button class="btn btn-light fs-4" id="btn">&minus;</button>
                <button class="btn btn-light fs-4" id="btn"><i class="bi bi-volume-mute-fill"></i></button>
              </div>
              <div class="d-flex justify-content-center gap-3">
                <button class="btn btn-light fs-4"><i class="bi bi-rewind-fill"></i></button>
                <button class="btn btn-light fs-4"><i class="bi bi-play-fill" id="playBtn"></i></button>
                <button class="btn btn-light fs-4"><i class="bi bi-fast-forward-fill" id="nextBtn"></i></button>
              </div>
              <div class="d-flex justify-content-center gap-3">
                <button class="btn btn-light fs-4" id="startBtn"><i class="bi bi-house-door-fill"></i></button>
                <button class="btn btn-light fs-4"><i class="bi bi-gear-fill"></i></button>
                <button class="btn btn-light fs-4" id="connectButton"><i class="bi bi-power"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}
export default Manette;
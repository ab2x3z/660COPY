//import React, { useEffect } from "react";
//import {
//  Dialog,
//  DialogContent,
//  DialogHeader,
//  DialogTitle,
//  DialogDescription,
//} from "../components/ui/dialog";
//import { ScrollArea } from "../components/ui/scroll-area";
//import { Clock, Calendar, Globe } from "lucide-react";
//import { useModal } from "../../hooks/use-modal-store"
//
//const MovieModal = () => {
//
//  const { isOpen, onClose, type, data: movie } = useModal();
//  const isModalOpen = isOpen && type === "movieModal";
//
//  if (!isModalOpen) return null;
//
//
//  return (
//    <Dialog open={isModalOpen} onOpenChange={onClose}>
//      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
//        <DialogHeader>
//          <DialogTitle className="text-2xl font-bold">
//            {movie.TITRE}
//          </DialogTitle>
//          <DialogDescription>
//            <div className="flex items-center gap-2 text-gray-500">
//              <Calendar className="w-4 h-4" />
//              <span>{movie.ANNEE}</span>
//              <Clock className="w-4 h-4 ml-4" />
//              <span>{movie.DUREE} min</span>
//              <Globe className="w-4 h-4 ml-4" />
//              <span>{movie.LANGUE}</span>
//            </div>
//          </DialogDescription>
//        </DialogHeader>
//
//        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//          <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100">
//            {movie.POSTER_URL ? (
//              <img 
//                src={movie.POSTER_URL} 
//                alt={movie.TITRE}
//                className="object-cover w-full h-full"
//              />
//            ) : (
//              <div className="flex items-center justify-center w-full h-full text-gray-400">
//                No poster available
//              </div>
//            )}
//          </div>
//
//          <ScrollArea className="h-[60vh]">
//            <div className="space-y-6 pr-4">
//              <div>
//                <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
//                <p className="text-gray-600">
//                  {movie.RESUME || "No synopsis available."}
//                </p>
//              </div>
//
//              <div>
//                <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
//                <dl className="space-y-2">
//                  <div>
//                    <dt className="text-sm font-medium text-gray-500">Director ID</dt>
//                    <dd className="text-gray-700">{movie.ID_REALISATEUR || "Not available"}</dd>
//                  </div>
//                  <div>
//                    <dt className="text-sm font-medium text-gray-500">Movie ID</dt>
//                    <dd className="text-gray-700">{movie.ID}</dd>
//                  </div>
//                </dl>
//              </div>
//            </div>
//          </ScrollArea>
//        </div>
//      </DialogContent>
//    </Dialog>
//  );
//};
//
//export default MovieModal;
